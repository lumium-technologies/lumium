use serde::{Deserialize, Serialize};
use serde_crypt;
use serde_crypt_macro::serde_crypt_gen;
use tsify::Tsify;
use utoipa::ToSchema;

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantCreateDTO {
    #[serde(with = "serde_crypt")]
    pub activator: Vec<u8>,
    #[serde(with = "serde_crypt")]
    pub value: Vec<u8>,
}

#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyCreateDTO {
    pub keys: Vec<String>,
    pub activator: Vec<u8>,
}

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantDTO {
    #[serde_crypt_types(Vec<u8>, Vec<u8>)]
    pub activator: _,
    #[serde_crypt_types(Vec<u8>, Vec<u8>)]
    pub value: _,
}

#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyDTO {
    pub keys: Vec<E2EKeyVariantDTOEncrypted>,
    pub activator: Vec<u8>,
}
