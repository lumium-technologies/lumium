use serde::{Deserialize, Serialize};
use serde_crypt;
use serde_crypt_macro::serde_crypt_gen;
use utoipa::ToSchema;

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyVariantCreateDTO {
    #[serde(with = "serde_crypt")]
    pub activator: String,
    #[serde(with = "serde_crypt")]
    pub value: String,
}

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct E2EKeyCreateDTO {
    #[serde_crypt_types(Vec<E2EKeyVariantCreateDTOEncrypted>, Vec<E2EKeyVariantCreateDTODecrypted>)]
    pub keys: _,
    pub activator: String,
}
