use crate::transfer::e2ekeys::{E2EKeyCreateDTO, E2EKeyDTO};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceCreateDTO {
    pub key: E2EKeyCreateDTO,
    pub name: String,
}

#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
#[wasm_bindgen]
pub struct WorkspaceDTO {
    #[wasm_bindgen(skip)]
    pub key: E2EKeyDTO,
    #[wasm_bindgen(getter_with_clone)]
    pub name: String,
}
