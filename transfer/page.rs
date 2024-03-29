use serde::{Deserialize, Serialize};
use serde_crypt_macro::serde_crypt_gen;
use tsify::Tsify;
use utoipa::ToSchema;

use paste::paste;
use wasm_bindgen::prelude::*;

#[serde_crypt_gen]
#[derive(Debug, Serialize, Deserialize, ToSchema, Tsify, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PageDTO {
    pub workspace_id: String,
    pub owner_id: String,
    pub admins: Vec<String>,
    pub members: Vec<String>,
    pub visitors: Vec<String>,
    #[serde(with = "serde_crypt")]
    pub name: String,
    #[serde(with = "serde_crypt")]
    pub content: String,
}

gen_ts_mapping!(PageDTOEncrypted);
gen_ts_mapping!(PageDTODecrypted);
