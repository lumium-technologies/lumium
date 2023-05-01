use axum::{extract::State, Json, TypedHeader};

use crate::{
    services::{
        session::SessionService,
        workspace::{WorkspaceService, WorkspaceServiceError},
    },
    transfer::workspace::{WorkspaceCreateDTO, WorkspaceDTOEncrypted},
};

use super::auth::SessionHeader;

#[utoipa::path(
    put,
    path = "/v1/workspace",
    request_body = WorkspaceCreateDTO,
    responses(
        (status = 200, description = "Success", body = WorkspaceDTOEncrypted),
        (status = 401, description = "Unauthorized"),
        ),
    security(
        ("Lumium Session" = [])
    ),
    tag = "workspace"
    )]
pub async fn create_workspace(
    State(workspace): State<WorkspaceService>,
    State(session): State<SessionService>,
    session_header: TypedHeader<SessionHeader>,
    Json(workspace_create_dto): Json<WorkspaceCreateDTO>,
) -> Result<Json<WorkspaceDTOEncrypted>, WorkspaceServiceError> {
    let TypedHeader(SessionHeader(session_id)) = session_header;
    let profile_id = session.verify(&session_id).await?;
    workspace.create(workspace_create_dto, profile_id).await
}
