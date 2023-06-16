use crate::transfer::constants::*;
use crate::transfer::e2ekeys::E2EKeyCreateDTO;
use crate::transfer::e2ekeys::E2EKeyVariantCreateDTO;
use crate::transfer::workspace::WorkspaceDTOEncrypted;
use crate::JsFuture;
use wasm_bindgen::prelude::*;

use base64::engine::general_purpose;
use base64::Engine;
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
    let mut variants = Vec::new();
    serde_crypt::setup(password.as_bytes().to_vec());
    let variant = E2EKeyVariantCreateDTO {
        activator: serde_crypt::e(activator).map_err(|e| JsValue::from(e.to_string()))?,
        value: serde_crypt::e(master_key).map_err(|e| JsValue::from(e.to_string()))?,
    };
    variants.push(variant);
    for recovery in &recovery_codes {
        serde_crypt::setup(recovery.as_bytes().to_vec());
        let variant = E2EKeyVariantCreateDTO {
            activator: serde_crypt::e(activator).map_err(|e| JsValue::from(e.to_string()))?,
            value: serde_crypt::e(master_key).map_err(|e| JsValue::from(e.to_string()))?,
        };
        variants.push(variant);
    }
    let key_create_dto = E2EKeyCreateDTO {
        keys: variants,
        activator: general_purpose::URL_SAFE_NO_PAD.encode(activator),
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
    let resp = get!(format!("{}/{}", API_V1_WORKSPACE, workspace_id).as_str());
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
        let activator = serde_crypt::d::<String>(variant_dto.activator);
        if let Err(..) = activator {
            continue;
        }
        if workspace_dto.key.activator
            == general_purpose::URL_SAFE_NO_PAD.encode(activator.unwrap())
        {
            serde_crypt::setup(
                serde_crypt::d(variant_dto.value).map_err(|e| JsValue::from(e.to_string()))?,
            );
            return Ok(());
        }
    }

    Err(JsValue::from("failed to decrypt workspace key"))
}
