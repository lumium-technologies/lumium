use std::error::Error;
use std::fmt::{Debug, Display, Formatter};

use axum::extract::{FromRequestParts, State};
use axum::headers::authorization::{Bearer, Credentials};
use axum::headers::Authorization;
use axum::http::request::Parts;
use axum::http::{Request, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use axum::TypedHeader;

use crate::services::session::SessionService;
use async_trait::async_trait;

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
pub struct AuthHeader<C: Credentials>(pub TypedHeader<Authorization<C>>);

#[async_trait]
impl<C, S> FromRequestParts<S> for AuthHeader<C>
where
    S: Send + Sync,
    C: Credentials,
{
    type Rejection = AuthHeaderRejection;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let r = TypedHeader::<Authorization<C>>::from_request_parts(parts, state).await;
        r.map(|h| AuthHeader(h)).map_err(|_| AuthHeaderRejection {})
    }
}

#[derive(Debug)]
pub struct AuthHeaderRejection;

impl IntoResponse for AuthHeaderRejection {
    fn into_response(self) -> Response {
        (StatusCode::UNAUTHORIZED).into_response()
    }
}

pub async fn auth_guard<T>(
    State(sessions): State<SessionService>,
    AuthHeader(auth): AuthHeader<Bearer>,
    // TypedHeader(auth): TypedHeader<Authorization<Bearer>>,
    request: Request<T>,
    next: Next<T>,
) -> Result<Response, AuthError> {
    // todo!()
    Ok(next.run(request).await)
}
