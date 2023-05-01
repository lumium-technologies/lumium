use crate::request;
use crate::transfer::constants::*;
use crate::transfer::e2ekeys::E2EKeyCreateDTO;
use crate::transfer::e2ekeys::E2EKeyVariantCreateDTODecrypted;
use crate::transfer::workspace::WorkspaceDTOEncrypted;
use crate::JsFuture;
use wasm_bindgen::prelude::*;

use once_cell::sync::Lazy;
use passwords::PasswordGenerator;
use ring::rand::{SecureRandom, SystemRandom};
use std::sync::Mutex;

const MASTER_KEY_BYTE_LENGTH: usize = 32;
const ACTIVATOR_KEY_BYTE_LENGTH: usize = 32;
const RECOVERY_CODE_LENGTH: usize = 24;
const NUM_RECOVERY_CODES: usize = 16;
const RECOVERY_CODES_FILE_NAME: &str = "lumium_recovery_codes.txt";

#[wasm_bindgen(module = "/js/download.js")]
extern "C" {
    fn download(file: String, content: String);
}

static PASSWORD: Lazy<Mutex<Vec<u8>>> = Lazy::new(|| Mutex::new(vec![]));

pub fn generate_key_variants(password: String) -> Result<E2EKeyCreateDTO, JsValue> {
    let sr = SystemRandom::new();
    let mut master_key: [u8; MASTER_KEY_BYTE_LENGTH] = [0; MASTER_KEY_BYTE_LENGTH];
    sr.fill(&mut master_key).unwrap();
    let mut activator: [u8; ACTIVATOR_KEY_BYTE_LENGTH] = [0; ACTIVATOR_KEY_BYTE_LENGTH];
    sr.fill(&mut activator).unwrap();
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
    let mut variants = Vec::<String>::new();
    let variant = E2EKeyVariantCreateDTODecrypted {
        activator: activator.to_vec(),
        value: master_key.to_vec(),
    };
    serde_crypt::setup(password.as_bytes().to_vec());
    let variant = serde_json::to_string(&variant).unwrap();
    variants.push(variant);
    for recovery in &recovery_codes {
        let variant = E2EKeyVariantCreateDTODecrypted {
            activator: activator.to_vec(),
            value: master_key.to_vec(),
        };
        serde_crypt::setup(recovery.as_bytes().to_vec());
        let variant = serde_json::to_string(&variant).unwrap();
        variants.push(variant);
    }
    let key_create_dto = E2EKeyCreateDTO {
        keys: variants,
        activator: activator.to_vec(),
    };

    download(
        RECOVERY_CODES_FILE_NAME.to_string(),
        recovery_codes.join("\n"),
    );

    serde_crypt::setup(master_key.to_vec());
    *PASSWORD.lock().unwrap() = password.as_bytes().to_vec();

    Ok(key_create_dto)
}

pub async fn decrypt_key() -> Result<(), JsValue> {
    if !PASSWORD.lock().unwrap().is_empty() {
        return Ok(());
    }

    let window = web_sys::window().unwrap();
    let workspace_id = window.location().pathname()?;
    let resp = request(
        "GET",
        format!("{}/{}", API_V1_WORKSPACE, workspace_id).as_str(),
        None,
    )
    .await?;
    if resp.status() != 200 {
        return Err(JsValue::from("failed to get workspace"));
    }

    let json = JsFuture::from(resp.json()?).await?;
    let password = window
        .local_storage()?
        .unwrap()
        .get_item(LOCAL_STORAGE_PASSWORD_KEY)?
        .unwrap();
    let workspace_dto: WorkspaceDTOEncrypted = serde_wasm_bindgen::from_value(json)?;

    for variant_dto in workspace_dto.key.keys {
        serde_crypt::setup(password.as_bytes().to_vec());
        let activator =
            serde_crypt::d::<Vec<u8>>(String::from_utf8(variant_dto.activator).unwrap());
        if let Err(..) = activator {
            continue;
        }
        if workspace_dto.key.activator == activator.unwrap() {
            serde_crypt::setup(
                serde_crypt::d(String::from_utf8(variant_dto.value).unwrap())
                    .map_err(|e| JsValue::from(e.to_string()))?,
            );
            return Ok(());
        }
    }

    Err(JsValue::from("failed to decrypt workspace key"))
}
