pub mod crypto;
pub mod render;
pub mod transfer;

use crate::transfer::constants::*;
use crate::transfer::workspace::WorkspaceCreateDTO;
use crypto::generate_key_variants;
use seed::{self, prelude::*, *};
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::RequestCredentials;
use web_sys::{Request, RequestInit, RequestMode, Response};

async fn request(method: &str, url: &str, body: Option<&JsValue>) -> Result<Response, JsValue> {
    let mut opts = RequestInit::new();
    opts.method(method);
    opts.credentials(RequestCredentials::Include);
    opts.mode(RequestMode::Cors);
    opts.body(body);
    let origin = format!("{}/{}", env!("RENDERER_API_HOST").to_string(), url);
    let request = Request::new_with_str_and_init(origin.as_str(), &opts)?;
    request.headers().set("Content-Type", "application/json")?;
    let window = web_sys::window().unwrap();
    let session = window
        .local_storage()?
        .unwrap()
        .get_item(X_LUMIUM_SESSION_HEADER)?
        .unwrap();
    request
        .headers()
        .set(X_LUMIUM_SESSION_HEADER, &session)
        .unwrap();
    let fetch = window.fetch_with_request(&request);
    let resp_value = JsFuture::from(fetch).await?;
    assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();
    Ok(resp)
}

#[wasm_bindgen]
pub async fn create_workspace(password: String, name: String) -> Result<JsValue, JsValue> {
    let key_create_dto = generate_key_variants(password)?;
    let workspace_create_dto = WorkspaceCreateDTO {
        key: key_create_dto,
        name,
    };

    let body = serde_json::ser::to_string(&workspace_create_dto).unwrap();

    let resp = request("PUT", WORKSPACE, Some(&JsValue::from(body))).await?;
    if resp.status() != 200 {
        return Err(JsValue::from("failed to create workspace"));
    }

    let json = JsFuture::from(resp.json()?).await?;

    Ok(json)
}
