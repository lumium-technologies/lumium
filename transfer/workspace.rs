use crate::transfer::e2ekeys::{E2EKeyCreateDTO, E2EKeyDTO};
use crate::transfer::page::PageDTODecrypted;
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
    pub owner_id: String,
    pub admins: Option<Vec<String>>,
    pub members: Option<Vec<String>>,
    pub visitors: Option<Vec<String>>,
    #[serde_crypt_types(Option<String>, Option<Vec<PageDTODecrypted>>)]
    pub pages: _,
}
