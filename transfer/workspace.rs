use crate::transfer::e2ekeys::{E2EKeyCreateDTO, E2EKeyDTO};
#[cfg(target_arch = "wasm32")]
use js_sys::JsString;
use serde::{Deserialize, Serialize};
use serde_crypt_macro::serde_crypt_gen;
use utoipa::ToSchema;
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceCreateDTO {
    pub key: E2EKeyCreateDTO,
    pub name: String,
}

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
#[wasm_bindgen]
pub struct WorkspaceDTO {
    #[wasm_bindgen(skip)]
    pub key: E2EKeyDTO,
    #[wasm_bindgen(getter_with_clone)]
    pub name: String,
    #[serde(with = "serde_crypt")]
    #[wasm_bindgen(getter_with_clone)]
    pub owner_id: String,
    #[serde(with = "serde_crypt")]
    #[wasm_bindgen(skip)]
    pub admins: Vec<String>,
    #[serde(with = "serde_crypt")]
    #[wasm_bindgen(skip)]
    pub members: Vec<String>,
    #[serde(with = "serde_crypt")]
    #[wasm_bindgen(skip)]
    pub visitors: Vec<String>,
    #[serde_crypt_types(Vec<PageDTOEncrypted>, Vec<PageDTODecrypted>)]
    #[wasm_bindgen(skip)]
    pub pages: _,
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
impl WorkspaceDTODecrypted {
    #[wasm_bindgen(getter)]
    pub fn get_admins(&self) -> Vec<JsString> {
        self.admins
            .iter()
            .map(|t| JsString::from(JsValue::from(t)))
            .collect()
    }

    #[wasm_bindgen(getter)]
    pub fn get_members(&self) -> Vec<JsString> {
        self.members
            .iter()
            .map(|t| JsString::from(JsValue::from(t)))
            .collect()
    }

    #[wasm_bindgen(getter)]
    pub fn get_visitors(&self) -> Vec<JsString> {
        self.visitors
            .iter()
            .map(|t| JsString::from(JsValue::from(t)))
            .collect()
    }
}

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema, Clone)]
#[serde(rename_all = "camelCase")]
#[wasm_bindgen]
pub struct PageDTO {
    #[serde(with = "serde_crypt")]
    #[wasm_bindgen(getter_with_clone)]
    pub name: String,
}
