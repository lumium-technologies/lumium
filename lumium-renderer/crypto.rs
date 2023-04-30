use crate::transfer::e2ekeys::E2EKeyCreateDTO;
use crate::transfer::e2ekeys::E2EKeyVariantCreateDTODecrypted;
use crate::transfer::e2ekeys::E2EKeyVariantDTODecrypted;
use crate::transfer::workspace::WorkspaceDTO;
use crate::JsFuture;
use crate::X_LUMIUM_SESSION_HEADER;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use once_cell::sync::Lazy;
use passwords::PasswordGenerator;
use ring::rand::{SecureRandom, SystemRandom};
use std::sync::Mutex;
use web_sys::{Request, RequestCredentials, RequestInit, RequestMode, Response};

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
    let session = window
        .local_storage()?
        .unwrap()
        .get_item(X_LUMIUM_SESSION_HEADER)?
        .unwrap();
    request
        .headers()
        .set("Content-Type", "application/json")
        .unwrap();
    request
        .headers()
        .set(X_LUMIUM_SESSION_HEADER, &session)
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
        serde_crypt::setup(password.as_bytes().to_vec());
        let variant = serde_json::from_str(&variant_dto);
        if let Err(..) = variant {
            continue;
        }
        let variant: E2EKeyVariantDTODecrypted = variant.unwrap();
        if workspace_dto.key.activator == variant.activator {
            serde_crypt::setup(variant.value);
            return Ok(());
        }
    }

    Err(JsValue::from("failed to decrypt workspace key"))
}
