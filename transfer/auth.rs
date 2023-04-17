use serde::Deserialize;
use utoipa::ToSchema;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Deserialize, ToSchema)]
#[wasm_bindgen]
pub struct SignUpDTO {
    #[wasm_bindgen(getter_with_clone)]
    pub email: String,
    #[wasm_bindgen(getter_with_clone)]
    pub username: String,
    #[wasm_bindgen(getter_with_clone)]
    pub password: String,
}

#[derive(Deserialize, ToSchema)]
#[wasm_bindgen]
pub struct SignInDTO {
    #[wasm_bindgen(getter_with_clone)]
    pub email: String,
    #[wasm_bindgen(getter_with_clone)]
    pub password: String,
}
