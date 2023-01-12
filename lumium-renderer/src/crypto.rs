use crate::JsFuture;
use ring::aead::UnboundKey;
use ring::digest;
use ring::digest::digest;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use passwords::PasswordGenerator;
use ring::aead::{
    Aad, BoundKey, Nonce, NonceSequence, OpeningKey, SealingKey, AES_256_GCM, NONCE_LEN,
};
use ring::error;
use ring::rand::{SecureRandom, SystemRandom};
use std::cell::RefCell;
use std::convert::TryInto;
use std::sync::Arc;
use std::sync::Mutex;
use web_sys::{Request, RequestCredentials, RequestInit, RequestMode, Response};

use crate::dtos::{E2EKeyCreateDTO, E2EKeyVariantCreateDTO, WorkspaceDTO};

const MASTER_KEY_BYTE_LENGTH: usize = 32;
const ACTIVATOR_KEY_BYTE_LENGTH: usize = 32;
const RECOVERY_CODE_LENGTH: usize = 24;
const NUM_RECOVERY_CODES: usize = 16;
const RECOVERY_CODES_FILE_NAME: &str = "lumium_recovery_codes.txt";

lazy_static! {
    static ref MASTER_KEY: Arc<Mutex<RefCell<([u8; MASTER_KEY_BYTE_LENGTH], bool)>>> = Arc::new(
        Mutex::new(RefCell::new(([0; MASTER_KEY_BYTE_LENGTH], false)))
    );
}

#[wasm_bindgen(module = "/js/download.js")]
extern "C" {
    fn download(file: String, content: String);
}

pub fn generate_key_variants(password: String) -> Result<E2EKeyCreateDTO, JsValue> {
    let sr = SystemRandom::new();
    let mut master_key: [u8; MASTER_KEY_BYTE_LENGTH] = [0; MASTER_KEY_BYTE_LENGTH];
    sr.fill(&mut master_key).unwrap();
    let mut activator_key: [u8; ACTIVATOR_KEY_BYTE_LENGTH] = [0; ACTIVATOR_KEY_BYTE_LENGTH];
    sr.fill(&mut activator_key).unwrap();
    let nonce_master_activator = generate_random_nonce();
    let cipher_master_activator = encrypt_data(
        password.as_bytes().into(),
        nonce_master_activator.clone(),
        activator_key.to_vec(),
    );
    let nonce_master_value = generate_random_nonce();
    let cipher_master_value = encrypt_data(
        password.as_bytes().into(),
        nonce_master_value.clone(),
        master_key.to_vec(),
    );
    let pg = PasswordGenerator {
        length: RECOVERY_CODE_LENGTH,
        numbers: true,
        lowercase_letters: true,
        uppercase_letters: true,
        symbols: false,
        spaces: false,
        exclude_similar_characters: false,
        strict: true,
    };
    let recovery_codes = pg.generate(NUM_RECOVERY_CODES).unwrap();
    let mut variants = Vec::<E2EKeyVariantCreateDTO>::new();
    variants.push(E2EKeyVariantCreateDTO {
        activator_nonce: nonce_master_activator.to_vec(),
        activator: cipher_master_activator,
        value_nonce: nonce_master_value.to_vec(),
        value: cipher_master_value,
    });
    for recovery in &recovery_codes {
        let nonce_recovery_activator = generate_random_nonce();
        let cipher_recovery_activator = encrypt_data(
            recovery.as_bytes().into(),
            nonce_recovery_activator.clone(),
            activator_key.to_vec(),
        );
        let nonce_recovery_value = generate_random_nonce();
        let cipher_recovery_value = encrypt_data(
            recovery.as_bytes().into(),
            nonce_recovery_value.clone(),
            master_key.to_vec(),
        );
        variants.push(E2EKeyVariantCreateDTO {
            activator_nonce: nonce_recovery_activator.to_vec(),
            activator: cipher_recovery_activator,
            value_nonce: nonce_recovery_value.to_vec(),
            value: cipher_recovery_value,
        });
    }
    let key_create_dto = E2EKeyCreateDTO {
        keys: variants,
        activator: activator_key.to_vec(),
    };

    download(
        RECOVERY_CODES_FILE_NAME.to_string(),
        recovery_codes.join("\n"),
    );

    let key = Arc::clone(&MASTER_KEY);
    let key = key.lock().unwrap();
    let mut key = key.borrow_mut();
    *key = (master_key, true);

    Ok(key_create_dto)
}

async fn decrypt_key() -> Result<[u8; MASTER_KEY_BYTE_LENGTH], JsValue> {
    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.credentials(RequestCredentials::Include);
    opts.mode(RequestMode::Cors);

    let window = web_sys::window().unwrap();
    let workspace_id = window.location().pathname()?;
    let origin = format!(
        "{}/{}/{}",
        env!("RENDERER_API_HOST").to_string(),
        "v1/secure/workspace",
        workspace_id
    );
    let request = Request::new_with_str_and_init(origin.as_str(), &opts)?;
    request
        .headers()
        .set("Content-Type", "application/json")
        .unwrap();

    let fetch = window.fetch_with_request(&request);
    let resp_value = JsFuture::from(fetch).await?;
    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();
    if resp.status() != 200 {
        return Err(JsValue::from("failed to get workspace"));
    }

    let json = JsFuture::from(resp.json()?).await?;
    let password = window
        .local_storage()?
        .unwrap()
        .get_item("workspacePassword")?
        .unwrap();
    let workspace_dto: WorkspaceDTO = serde_wasm_bindgen::from_value(json)?;

    for variant_dto in workspace_dto.key.keys {
        if encrypt_data(
            password.as_bytes(),
            variant_dto.activator_nonce.clone().try_into().unwrap(),
            workspace_dto.key.activator.clone(),
        ) == variant_dto.activator
        {
            return Ok(decrypt_data(
                password.as_bytes(),
                variant_dto.value_nonce.try_into().unwrap(),
                variant_dto.value,
            )
            .try_into()
            .unwrap());
        }
    }

    Err(JsValue::from("failed to decrypt workspace key"))
}

async fn get_key() -> Result<[u8; MASTER_KEY_BYTE_LENGTH], JsValue> {
    let key = MASTER_KEY.lock().unwrap().borrow().clone();

    if !key.1 {
        let decrypted = decrypt_key().await?;
        let key = Arc::clone(&MASTER_KEY);
        let key = key.lock().unwrap();
        let mut key = key.borrow_mut();
        *key = (decrypted, true);

        return Ok(decrypted);
    }

    Ok(key.0)
}

pub async fn encrypt(nonce: [u8; NONCE_LEN], data: Vec<u8>) -> Result<Vec<u8>, JsValue> {
    Ok(encrypt_data(&get_key().await?, nonce, data))
}

pub async fn decrypt(nonce: [u8; NONCE_LEN], data: Vec<u8>) -> Result<Vec<u8>, JsValue> {
    Ok(decrypt_data(&get_key().await?, nonce, data))
}

pub fn encrypt_data(key: &[u8], nonce: [u8; NONCE_LEN], mut data: Vec<u8>) -> Vec<u8> {
    let (key, nonce) = prepare_key(key, nonce);
    let mut encryption_key = SealingKey::new(key, nonce);
    encryption_key
        .seal_in_place_append_tag(Aad::empty(), &mut data)
        .unwrap();
    data
}

pub fn decrypt_data(key: &[u8], nonce: [u8; NONCE_LEN], mut data: Vec<u8>) -> Vec<u8> {
    let (key, nonce) = prepare_key(key, nonce);
    let mut decryption_key = OpeningKey::new(key, nonce);
    let length = data.len() - AES_256_GCM.tag_len();
    decryption_key
        .open_in_place(Aad::empty(), &mut data)
        .unwrap();
    data[..length].to_vec()
}

struct INonceSequence(Option<Nonce>);

impl INonceSequence {
    fn new(nonce: Nonce) -> Self {
        Self(Some(nonce))
    }
}

impl NonceSequence for INonceSequence {
    fn advance(&mut self) -> Result<Nonce, error::Unspecified> {
        self.0.take().ok_or(error::Unspecified)
    }
}

pub fn generate_random_nonce() -> [u8; NONCE_LEN] {
    let rand_gen = SystemRandom::new();
    let mut raw_nonce = [0u8; NONCE_LEN];
    rand_gen.fill(&mut raw_nonce).unwrap();
    raw_nonce
}

fn prepare_key(key: &[u8], nonce: [u8; NONCE_LEN]) -> (UnboundKey, INonceSequence) {
    let digest = digest(&digest::SHA256, key);
    let key = digest.as_ref();
    let nonce_sequence = INonceSequence::new(Nonce::assume_unique_for_key(nonce));
    (UnboundKey::new(&AES_256_GCM, &key).unwrap(), nonce_sequence)
}
