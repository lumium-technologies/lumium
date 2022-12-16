pub mod crypto;
pub mod render;

use crypto::generate_key_variants;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};

use seed::{self, prelude::*, *};

#[wasm_bindgen]
pub async fn create_workspace(password: String) -> Result<JsValue, JsValue> {
    let key_create_dto = generate_key_variants(password)?;

    let mut opts = RequestInit::new();
    opts.method("PUT");
    opts.mode(RequestMode::Cors);
    let body = serde_json::ser::to_string(&key_create_dto).unwrap();
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
