use serde::{Deserialize, Serialize};
use tsify::Tsify;
use utoipa::ToSchema;

use paste::paste;
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
pub struct SignUpDTO {
    pub email: String,
    pub username: String,
    pub password: String,
}

gen_ts_mapping!(SignUpDTO);

#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
pub struct SignInDTO {
    pub email: String,
    pub password: String,
}

gen_ts_mapping!(SignInDTO);
