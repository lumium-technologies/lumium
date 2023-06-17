#[macro_use]
pub mod request;
pub mod crypto;
pub mod render;
pub mod transfer;

use crate::transfer::constants::*;
use crate::transfer::workspace::{
    TWorkspaceDTODecrypted, TWorkspaceDTOEncrypted, WorkspaceCreateDTO,
};
use crypto::generate_key_variants;
use seed::{self, prelude::*, *};

#[wasm_bindgen]
pub async fn create_workspace(
    password: String,
    name: String,
) -> Result<TWorkspaceDTOEncrypted, JsValue> {
    let key_create_dto = generate_key_variants(password)?;
    let workspace_create_dto = WorkspaceCreateDTO {
        key: key_create_dto,
        name,
    };

    let body = serde_json::ser::to_string(&workspace_create_dto).unwrap();

    let resp = put!(API_V1_WORKSPACE, body);
    if resp.status() != 200 {
        return Err(JsValue::from("failed to create workspace"));
    }

    Ok(res!(resp))
}

#[wasm_bindgen]
pub async fn get_workspace(workspace_id: String) -> Result<TWorkspaceDTODecrypted, JsValue> {
    let resp = get!(format!("{}/{}", API_V1_WORKSPACE, workspace_id).as_str());
    if resp.status() != 200 {
        return Err(JsValue::from("error"));
    }

    Ok(res!(resp))
}
