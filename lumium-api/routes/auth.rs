use std::error::Error;
use std::fmt::{Display, Formatter};
use std::net::SocketAddr;

use axum::extract::{ConnectInfo, Json, State};
use axum::headers::UserAgent;
use axum::response::{AppendHeaders, IntoResponse, Response};
use axum::TypedHeader;

use crate::services::profile::{ProfileService, ProfileServiceError, VerifyOn};
use crate::services::session::{SessionService, SessionServiceError};
use crate::transfer::auth::{SignInDTO, SignUpDTO};

use super::guard::SessionHeader;

#[derive(Debug)]
pub enum AuthServiceError {
    SessionServiceError(SessionServiceError),
    ProfileServiceError(ProfileServiceError),
}

impl IntoResponse for AuthServiceError {
    fn into_response(self) -> Response {
        match self {
            AuthServiceError::SessionServiceError(e) => e.into_response(),
            AuthServiceError::ProfileServiceError(e) => e.into_response(),
        }
    }
}

impl Display for AuthServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl Error for AuthServiceError {}

#[utoipa::path(
    post,
    path = "/v1/auth/signup",
    request_body = SignUpDTO,
    responses(
        (status = 200, description = "Sign up successful")
    ),
    tag = "auth"
)]
pub async fn sign_up(
    State(session): State<SessionService>,
    State(profile): State<ProfileService>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    TypedHeader(user_agent): TypedHeader<UserAgent>,
    Json(json): Json<SignUpDTO>,
) -> Result<impl IntoResponse, AuthServiceError> {
    let profile_id = profile
        .create(&json.email, &json.username, &json.password)
        .await
        .map_err(|e| AuthServiceError::ProfileServiceError(e))?;
    let session = session
        .create(&profile_id, addr.to_string().as_str(), user_agent.as_str())
        .await
        .map_err(|e| AuthServiceError::SessionServiceError(e))?;
    Ok(AppendHeaders([SessionHeader(session).into()]))
}

#[utoipa::path(
    post,
    path = "/v1/auth/signin",
    request_body = SignInDTO,
    responses(
        (status = 200, description = "Sign in successful")
    ),
    tag = "auth"
)]
pub async fn sign_in(
    State(session): State<SessionService>,
    State(profile): State<ProfileService>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    TypedHeader(user_agent): TypedHeader<UserAgent>,
    Json(json): Json<SignInDTO>,
) -> Result<impl IntoResponse, AuthServiceError> {
    let profile = profile
        .verify(&json.password, VerifyOn::Email(&json.email))
        .await
        .map_err(|e| AuthServiceError::ProfileServiceError(e))?;
    let session = session
        .create(
            &profile,
            addr.ip().to_string().as_str(),
            user_agent.as_str(),
        )
        .await
        .map_err(|e| AuthServiceError::SessionServiceError(e))?;
    Ok(AppendHeaders([SessionHeader(session).into()]))
}

#[utoipa::path(
    post,
    path = "/v1/auth/signout",
    responses(
        (status = 200, description = "Sign out successful")
    ),
    security(
        ("Lumium Session" = [])
    ),
    tag = "auth"
    )]
pub async fn sign_out(
    State(session): State<SessionService>,
    session_header: TypedHeader<SessionHeader>,
) -> Result<impl IntoResponse, AuthServiceError> {
    let TypedHeader(SessionHeader(session_id)) = session_header;
    session
        .destroy(&session_id)
        .await
        .map_err(|e| AuthServiceError::SessionServiceError(e))?;

    Ok(())
}
