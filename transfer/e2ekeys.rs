use serde::{Deserialize, Serialize};
use tsify::Tsify;
use utoipa::ToSchema;

#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantCreateDTO {
    pub activator: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyCreateDTO {
    pub keys: Vec<E2EKeyVariantCreateDTO>,
    pub activator: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantDTO {
    pub activator: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyDTO {
    pub keys: Vec<E2EKeyVariantDTO>,
    pub activator: String,
}
