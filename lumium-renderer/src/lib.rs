pub mod crypto;
pub mod dtos;
pub mod render;

#[macro_use]
extern crate lazy_static;

use crypto::{decrypt, encrypt, generate_key_variants, generate_random_nonce};
use dtos::WorkspaceCreateDTO;
use ring::aead::NONCE_LEN;
use seed::{self, prelude::*, *};
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::RequestCredentials;
use web_sys::{Request, RequestInit, RequestMode, Response};

#[wasm_bindgen]
pub async fn enc(content: String) -> Result<String, JsValue> {
    let nonce = generate_random_nonce();
    let encrypt = base64::encode(encrypt(nonce, content.as_bytes().to_vec()).await?);
    let nonce = base64::encode(nonce);

    Ok(format!("{}.{}", &nonce, &encrypt))
}

#[wasm_bindgen]
pub async fn dec(content: String) -> Result<String, JsValue> {
    let parts = content.split(".");
    let parts: Vec<Vec<u8>> = parts
        .map(|p| base64::decode(p.as_bytes()).unwrap())
        .collect();
    if parts.len() != 2 {
        return Err(JsValue::from("failed to parse nonce"));
    }
    let nonce: [u8; NONCE_LEN] = parts.get(0).unwrap().clone().try_into().unwrap();
    let data = parts.get(1).unwrap().to_vec();
    let data = decrypt(nonce, data).await?;
    let content = std::str::from_utf8(&data).unwrap();

    Ok(content.to_string())
}

#[wasm_bindgen]
pub async fn create_workspace(password: String, name: String) -> Result<JsValue, JsValue> {
    let key_create_dto = generate_key_variants(password)?;
    let workspace_create_dto = WorkspaceCreateDTO {
        key: key_create_dto,
        name: enc(name).await?,
    };

    let mut opts = RequestInit::new();
    opts.method("PUT");
    opts.credentials(RequestCredentials::Include);
    opts.mode(RequestMode::Cors);
    let body = serde_json::ser::to_string(&workspace_create_dto).unwrap();
    opts.body(Some(&JsValue::from(body)));

    let origin = format!(
        "{}/{}",
        env!("RENDERER_API_HOST").to_string(),
        "v1/secure/workspace"
    );
    let request = Request::new_with_str_and_init(origin.as_str(), &opts)?;
    request.headers().set("Content-Type", "application/json")?;

    let window = web_sys::window().unwrap();
    let fetch = window.fetch_with_request(&request);
    let resp_value = JsFuture::from(fetch).await?;
    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();
    if resp.status() != 200 {
        return Err(JsValue::from("failed to create workspace"));
    }

    let json = JsFuture::from(resp.json()?).await?;

    Ok(json)
}
