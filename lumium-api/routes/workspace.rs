use axum::{extract::State, Json, TypedHeader};

use crate::{
    services::{
        session::SessionService,
        workspace::{WorkspaceService, WorkspaceServiceError},
    },
    transfer::workspace::{WorkspaceCreateDTO, WorkspaceDTOEncrypted},
};

use super::guard::SessionHeader;

#[utoipa::path(
    put,
    path = "/v1/workspace",
    request_body = WorkspaceCreateDTO,
    responses(
        (status = 200, description = "Success", body = WorkspaceDTOEncrypted),
        (status = 401, description = "Unauthorized"),
        ),
    tag = "workspace"
    )]
pub async fn create_workspace(
    State(workspace): State<WorkspaceService>,
    State(session): State<SessionService>,
    session_header: TypedHeader<SessionHeader>,
    Json(workspace_create_dto): Json<WorkspaceCreateDTO>,
) -> Result<Json<WorkspaceDTOEncrypted>, WorkspaceServiceError> {
    let profile_id = session
        .get_profile(session_header)
        .await
        .map_err(|_| WorkspaceServiceError::InternalError)?;
    workspace
        .create(workspace_create_dto, profile_id.as_str())
        .await
}
