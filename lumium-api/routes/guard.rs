use std::error::Error;
use std::fmt::{Debug, Display, Formatter};

use axum::extract::State;
use axum::http::Request;
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};

use crate::services::SessionService;

#[derive(Debug)]
pub struct AuthError {}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        todo!()
    }
}

impl Display for AuthError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl Error for AuthError {}

pub async fn auth_guard<T>(
    State(sessions): State<SessionService>,
    request: Request<T>,
    next: Next<T>,
) -> Result<Response, AuthError> {
    todo!()
}
