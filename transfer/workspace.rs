use crate::transfer::e2ekeys::{E2EKeyCreateDTO, E2EKeyDTO};
use serde::{Deserialize, Serialize};
use serde_crypt_macro::serde_crypt_gen;
use tsify::Tsify;
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceCreateDTO {
    pub key: E2EKeyCreateDTO,
    pub name: String,
}

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceDTO {
    pub key: E2EKeyDTO,
    pub id: String,
    pub name: String,
    #[serde(with = "serde_crypt")]
    pub owner_id: String,
    #[serde(with = "serde_crypt")]
    pub admins: Vec<String>,
    #[serde(with = "serde_crypt")]
    pub members: Vec<String>,
    #[serde(with = "serde_crypt")]
    pub visitors: Vec<String>,
    #[serde_crypt_types(Vec<PageDTOEncrypted>, Vec<PageDTODecrypted>)]
    pub pages: _,
}

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PageDTO {
    #[serde(with = "serde_crypt")]
    pub name: String,
}
