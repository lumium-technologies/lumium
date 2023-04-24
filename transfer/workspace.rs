use crate::transfer::e2ekeys::{E2EKeyCreateDTODecrypted, E2EKeyCreateDTOEncrypted};
use serde::{Deserialize, Serialize};
use serde_crypt;
use serde_crypt_macro::serde_crypt_gen;
use utoipa::ToSchema;

#[serde_crypt_gen]
#[derive(Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct WorkspaceCreateDTO {
    #[serde_crypt_types(E2EKeyCreateDTOEncrypted, E2EKeyCreateDTODecrypted)]
    pub key: E2EKeyCreateDTO,
    #[serde(with = "serde_crypt")]
    pub name: String,
}
