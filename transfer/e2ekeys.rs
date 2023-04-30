use serde::{Deserialize, Serialize};
use serde_crypt;
use serde_crypt_macro::serde_crypt_gen;
use utoipa::ToSchema;

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantCreateDTO {
    #[serde(with = "serde_crypt")]
    pub activator: Vec<u8>,
    #[serde(with = "serde_crypt")]
    pub value: Vec<u8>,
}

#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyCreateDTO {
    pub keys: Vec<String>,
    pub activator: Vec<u8>,
}

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantDTO {
    #[serde(with = "serde_crypt")]
    pub activator: Vec<u8>,
    #[serde(with = "serde_crypt")]
    pub value: Vec<u8>,
}

#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyDTO {
    pub keys: Vec<String>,
    pub activator: Vec<u8>,
}
