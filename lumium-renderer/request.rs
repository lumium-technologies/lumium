use crate::transfer::constants::*;
use seed::{self, prelude::*, *};
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};

pub async fn request(method: &str, url: &str, body: Option<&JsValue>) -> Result<Response, JsValue> {
    let mut opts = RequestInit::new();
    opts.method(method);
    opts.mode(RequestMode::Cors);
    opts.body(body);
    let origin = format!("{}{}", env!("RENDERER_API_HOST").to_string(), url);
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

#[macro_export]
macro_rules! req {
    ($method:expr, $route:expr, $body:expr) => {
        crate::request::request($method, $route, Some(&JsValue::from($body))).await?
    };
    ($method:expr, $route:expr) => {
        crate::request::request($method, $route, None).await?
    };
}

macro_rules! http_method {
    ($method:ident) => {
        #[macro_export]
        macro_rules! $method {
            ($route:expr, $body:expr) => {
                req!(&stringify!($method).to_uppercase(), $route, $body)
            };
            ($route:expr) => {
                req!(&stringify!($method).to_uppercase(), $route)
            };
        }
    };
}

http_method!(get);
http_method!(head);
http_method!(post);
http_method!(put);
http_method!(delete);
http_method!(connect);
http_method!(options);
http_method!(trace);
http_method!(patch);
