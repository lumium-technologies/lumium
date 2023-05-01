use std::str::FromStr;

use axum::{http::StatusCode, response::IntoResponse, Json};
use sqlx::{types::Uuid, Error, Pool, Postgres};

use crate::transfer::{
    e2ekeys::{E2EKeyDTO, E2EKeyVariantDTOEncrypted},
    workspace::{WorkspaceCreateDTO, WorkspaceDTOEncrypted},
};

#[derive(Clone)]
pub struct WorkspaceService {
    database: Pool<Postgres>,
}

pub enum WorkspaceServiceError {
    InternalError,
}

impl IntoResponse for WorkspaceServiceError {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::InternalError => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        }
    }
}

impl From<Error> for WorkspaceServiceError {
    fn from(_: Error) -> Self {
        Self::InternalError
    }
}

impl From<sqlx::types::uuid::Error> for WorkspaceServiceError {
    fn from(_: sqlx::types::uuid::Error) -> Self {
        Self::InternalError
    }
}

impl WorkspaceService {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self { database }
    }

    pub async fn create(
        &self,
        workspace_create_dto: WorkspaceCreateDTO,
        owner: &str,
    ) -> Result<Json<WorkspaceDTOEncrypted>, WorkspaceServiceError> {
        let owner_id = Uuid::from_str(owner)?;
        let mut tx = self.database.begin().await?;
        let workspace_id = sqlx::query!(
            r#"INSERT INTO workspaces (owner_id, name) VALUES ($1, $2) RETURNING id"#,
            owner_id,
            workspace_create_dto.name
        )
        .fetch_one(&mut tx)
        .await?
        .id;
        let key_id = sqlx::query!(
            r#"INSERT INTO end_to_end_keys (workspace_id, activator) VALUES ($1, $2) RETURNING workspace_id"#,
             workspace_id,
            workspace_create_dto.key.activator
        )
        .fetch_one(&mut tx)
        .await?
        .workspace_id;

        let workspace = sqlx::query!(
            r#"SELECT id, name
            FROM workspaces
            WHERE id = $1"#,
            key_id
        )
        .fetch_one(&mut tx)
        .await?;

        let e2e_key = sqlx::query!(
            r#"SELECT workspace_id, activator
            FROM end_to_end_keys
            WHERE workspace_id = $1"#,
            key_id
        )
        .fetch_one(&mut tx)
        .await?;

        let e2e_key_variants = sqlx::query!(
            r#"SELECT key_id, activator, value
            FROM end_to_end_key_variants
            WHERE key_id = $1"#,
            key_id
        )
        .fetch_all(&mut tx)
        .await?;

        tx.commit().await?;

        let keys = e2e_key_variants
            .iter()
            .map(|t| E2EKeyVariantDTOEncrypted {
                activator: t.activator.clone(),
                value: t.value.clone(),
            })
            .collect();

        let workspace = WorkspaceDTOEncrypted {
            key: E2EKeyDTO {
                activator: e2e_key.activator,
                keys,
            },
            id: workspace.id.to_string(),
            name: workspace.name,
            owner_id: owner_id.to_string(),
            admins: None,
            members: None,
            visitors: None,
            pages: None,
        };

        Ok(Json(workspace))
    }
}
