use std::error::Error;
use std::fmt::{Debug, Display, Formatter};

use async_trait::async_trait;
use axum::extract::{FromRequestParts, State};
use axum::http::request::Parts;
use axum::http::{Request, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

use crate::services::session::SessionService;

pub const X_LUMIUM_SESSION_HEADER: &str = "x-lumium-session";

#[derive(Debug)]
pub struct AuthError;

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        (StatusCode::UNAUTHORIZED).into_response()
    }
}

impl Display for AuthError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl Error for AuthError {}

#[derive(Debug, Clone)] // Copy
pub struct SessionHeader(String);

#[derive(Debug)]
pub struct SessionHeaderRejection;

impl IntoResponse for SessionHeaderRejection {
    fn into_response(self) -> Response {
        (StatusCode::UNAUTHORIZED).into_response()
    }
}

#[async_trait]
impl<S> FromRequestParts<S> for SessionHeader
where
    S: Send + Sync,
{
    type Rejection = SessionHeaderRejection;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        if let Some(session) = parts.headers.get(X_LUMIUM_SESSION_HEADER) {
            Ok(SessionHeader(
                session
                    .to_str()
                    .map_err(|_| SessionHeaderRejection)?
                    .to_string(),
            ))
        } else {
            Err(SessionHeaderRejection)
        }
    }
}

pub async fn auth_guard<T>(
    State(sessions): State<SessionService>,
    SessionHeader(session_token): SessionHeader,
    request: Request<T>,
    next: Next<T>,
) -> Result<Response, AuthError> {
    // todo!()
    Ok(next.run(request).await)
}
