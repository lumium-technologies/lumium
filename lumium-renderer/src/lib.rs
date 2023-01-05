pub mod crypto;
pub mod dtos;
pub mod render;

#[macro_use]
extern crate lazy_static;

use crypto::{encrypt, generate_key_variants, generate_random_nonce};
use dtos::{PageDTO, WorkspaceCreateDTO};
use seed::{self, prelude::*, *};
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::RequestCredentials;
use web_sys::{Request, RequestInit, RequestMode, Response};

#[wasm_bindgen]
pub async fn create_workspace(password: String, name: String) -> Result<JsValue, JsValue> {
    let key_create_dto = generate_key_variants(password)?;
    let workspace_create_dto = WorkspaceCreateDTO {
        key: key_create_dto,
        name,
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

#[wasm_bindgen]
pub async fn sync_page(id: String, name: String, content: String) -> Result<JsValue, JsValue> {
    let nonce = generate_random_nonce();
    let content = encrypt(nonce, content.as_bytes().to_vec())?;
    let name = encrypt(nonce, name.as_bytes().to_vec())?;
    let page_dto = PageDTO {
        id,
        name,
        content,
        nonce: nonce.to_vec(),
    };
    let mut opts = RequestInit::new();
    opts.method("PATCH");
    opts.credentials(RequestCredentials::Include);
    opts.mode(RequestMode::Cors);
    let body = serde_json::ser::to_string(&page_dto).unwrap();
    opts.body(Some(&JsValue::from(body)));

    let origin = format!(
        "{}/{}",
        env!("RENDERER_API_HOST").to_string(),
        "v1/secure/page"
    );
    let request = Request::new_with_str_and_init(origin.as_str(), &opts)?;
    request.headers().set("Content-Type", "application/json")?;

    let window = web_sys::window().unwrap();
    let fetch = window.fetch_with_request(&request);
    let resp_value = JsFuture::from(fetch).await?;
    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();
    if resp.status() != 200 {
        return Err(JsValue::from("failed to update page"));
    }

    let json = JsFuture::from(resp.json()?).await?;

    Ok(json)
}
