pub mod crypto;
pub mod render;

use crypto::generate_key_variants;
use crypto::E2EKeyCreateDTO;
use seed::{self, prelude::*, *};
use serde::Serialize;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::RequestCredentials;
use web_sys::{Request, RequestInit, RequestMode, Response};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceCreateDTO {
    pub key: E2EKeyCreateDTO,
    pub name: String,
}

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
