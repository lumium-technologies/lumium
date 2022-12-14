use js_sys::Uint8Array;
use ring::aead::UnboundKey;
use ring::digest;
use ring::digest::digest;
use wasm_bindgen::prelude::*;

use passwords::PasswordGenerator;
use ring::aead::{
    Aad, BoundKey, Nonce, NonceSequence, OpeningKey, SealingKey, AES_256_GCM, NONCE_LEN,
};
use ring::error;
use ring::rand::{SecureRandom, SystemRandom};
use serde::{Deserialize, Serialize};

const MASTER_KEY_BYTE_LENGTH: usize = 32;
const ACTIVATOR_KEY_BYTE_LENGTH: usize = 32;
const RECOVERY_CODE_LENGTH: usize = 24;
const NUM_RECOVERY_CODES: usize = 16;
const RECOVERY_CODES_FILE_NAME: &str = "lumium_recovery_codes.txt";

#[wasm_bindgen(module = "/js/download.js")]
extern "C" {
    fn download(file: String, content: String);
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantCreateDTO {
    #[serde(with = "base64")]
    pub activator: Vec<u8>,
    #[serde(with = "base64")]
    pub activator_nonce: Vec<u8>,
    #[serde(with = "base64")]
    pub value: Vec<u8>,
    #[serde(with = "base64")]
    pub value_nonce: Vec<u8>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyCreateDTO {
    pub keys: Vec<E2EKeyVariantCreateDTO>,
    #[serde(with = "base64")]
    pub activator: Vec<u8>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantDTO {
    #[serde(with = "base64")]
    pub activator: Vec<u8>,
    #[serde(with = "base64")]
    pub activator_nonce: Vec<u8>,
    #[serde(with = "base64")]
    pub value: Vec<u8>,
    #[serde(with = "base64")]
    pub value_nonce: Vec<u8>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyDTO {
    pub keys: Vec<E2EKeyVariantDTO>,
    #[serde(with = "base64")]
    pub activator: Vec<u8>,
}

pub fn generate_key_variants(password: String) -> Result<E2EKeyCreateDTO, JsValue> {
    let sr = SystemRandom::new();
    let mut master_key: [u8; MASTER_KEY_BYTE_LENGTH] = [0; MASTER_KEY_BYTE_LENGTH];
    sr.fill(&mut master_key).unwrap();
    let mut activator_key: [u8; ACTIVATOR_KEY_BYTE_LENGTH] = [0; ACTIVATOR_KEY_BYTE_LENGTH];
    sr.fill(&mut activator_key).unwrap();
    let nonce_master_activator = generate_random_nonce();
    let cipher_master_activator = encrypt_data(
        password.as_bytes(),
        nonce_master_activator.clone(),
        activator_key.to_vec(),
    );
    let nonce_master_value = generate_random_nonce();
    let cipher_master_value = encrypt_data(
        password.as_bytes(),
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
            recovery.as_bytes(),
            nonce_recovery_activator.clone(),
            activator_key.to_vec(),
        );
        let nonce_recovery_value = generate_random_nonce();
        let cipher_recovery_value = encrypt_data(
            recovery.as_bytes(),
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

    Ok(key_create_dto)
}

fn crypt_key(key: &[u8], nonce: Uint8Array) -> (UnboundKey, INonceSequence) {
    let digest = digest(&digest::SHA256, key);
    let key = digest.as_ref();
    let mut nonce_buf = [0; NONCE_LEN];
    nonce.copy_to(&mut nonce_buf);
    let nonce_sequence = INonceSequence::new(Nonce::assume_unique_for_key(nonce_buf));
    (UnboundKey::new(&AES_256_GCM, &key).unwrap(), nonce_sequence)
}

pub fn encrypt_data(key: &[u8], nonce: Uint8Array, mut data: Vec<u8>) -> Vec<u8> {
    let (key, nonce) = crypt_key(key, nonce);
    let mut encryption_key = SealingKey::new(key, nonce);
    encryption_key
        .seal_in_place_append_tag(Aad::empty(), &mut data)
        .unwrap();
    data
}

pub fn decrypt_data(key: &[u8], nonce: Uint8Array, mut data: Vec<u8>) -> Vec<u8> {
    let (key, nonce) = crypt_key(key, nonce);
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

pub fn generate_random_nonce() -> Uint8Array {
    let rand_gen = SystemRandom::new();
    let mut raw_nonce = [0u8; NONCE_LEN];
    rand_gen.fill(&mut raw_nonce).unwrap();
    let array = Uint8Array::new_with_length(NONCE_LEN as u32);
    array.copy_from(&raw_nonce);
    array
}

mod base64 {
    use serde::{Deserialize, Serialize};
    use serde::{Deserializer, Serializer};

    pub fn serialize<S: Serializer>(v: &Vec<u8>, s: S) -> Result<S::Ok, S::Error> {
        let base64 = base64::encode(v);
        String::serialize(&base64, s)
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(d: D) -> Result<Vec<u8>, D::Error> {
        let base64 = String::deserialize(d)?;
        base64::decode(base64.as_bytes()).map_err(|e| serde::de::Error::custom(e))
    }
}
