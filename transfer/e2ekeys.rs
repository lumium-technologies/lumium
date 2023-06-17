use serde::{Deserialize, Serialize};
use tsify::Tsify;
use utoipa::ToSchema;

use paste::paste;
use wasm_bindgen::prelude::*;

#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantCreateDTO {
    pub activator: String,
    pub value: String,
}

gen_ts_mapping!(E2EKeyVariantCreateDTO);

#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyCreateDTO {
    pub keys: Vec<E2EKeyVariantCreateDTO>,
    pub activator: String,
}

gen_ts_mapping!(E2EKeyCreateDTO);

#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantDTO {
    pub activator: String,
    pub value: String,
}

gen_ts_mapping!(E2EKeyVariantDTO);

#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyDTO {
    pub keys: Vec<E2EKeyVariantDTO>,
    pub activator: String,
}

gen_ts_mapping!(E2EKeyDTO);
