use std::error::Error;
use std::fmt::{Display, Formatter};

use axum::extract::{Json, State};
use axum::http::StatusCode;
use axum::response::{AppendHeaders, IntoResponse, Response};
use axum::TypedHeader;
use axum_extra::extract::SignedCookieJar;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::services::profile::{ProfileService, ProfileServiceError, VerifyOn};
use crate::services::session::{SessionService, SessionServiceError};

use super::guard::SessionHeader;

#[derive(Deserialize, ToSchema)]
pub struct SignUp {
    email: String,
    username: String,
    password: String,
}

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
    request_body = SignUp,
    responses(
        (status = 200, description = "Sign up successful")
    ),
    tag = "auth"
)]
pub async fn sign_up(
    State(session): State<SessionService>,
    State(profile): State<ProfileService>,
    Json(json): Json<SignUp>,
) -> Result<impl IntoResponse, AuthServiceError> {
    let profile_id = profile
        .create(&json.email, &json.username, &json.password)
        .await
        .map_err(|e| AuthServiceError::ProfileServiceError(e))?;
    let session = session
        .create(&profile_id)
        .await
        .map_err(|e| AuthServiceError::SessionServiceError(e))?;
    Ok(AppendHeaders([SessionHeader(session).into()]))
}

#[derive(Deserialize, ToSchema)]
pub struct SignIn {
    email: String,
    password: String,
}

#[utoipa::path(
    post,
    path = "/v1/auth/signin",
    request_body = SignIn,
    responses(
        (status = 200, description = "Sign in successful")
    ),
    tag = "auth"
)]
pub async fn sign_in(
    State(session): State<SessionService>,
    State(profile): State<ProfileService>,
    Json(json): Json<SignIn>,
) -> Result<impl IntoResponse, AuthServiceError> {
    let profile = profile
        .verify(&json.password, VerifyOn::Email(&json.email))
        .await
        .map_err(|e| AuthServiceError::ProfileServiceError(e))?;
    let session = session
        .create(&profile)
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
