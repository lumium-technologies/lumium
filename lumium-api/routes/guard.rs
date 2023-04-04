use std::error::Error;
use std::fmt::{Debug, Display, Formatter};

use axum::extract::State;
use axum::headers::{Header, HeaderName};
use axum::http::{HeaderValue, Request, StatusCode};
use axum::middleware::Next;
use axum::response::{IntoResponse, Response};
use axum::TypedHeader;

use crate::services::session::{SessionService, SessionServiceError};

pub const X_LUMIUM_SESSION_HEADER_STRING: &str = "x-lumium-session";
static X_LUMIUM_SESSION_HEADER_NAME: HeaderName =
    HeaderName::from_static(X_LUMIUM_SESSION_HEADER_STRING);

#[derive(Debug)]
pub enum AuthError {
    SessionServiceError(SessionServiceError),
    Unauthorized,
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        match self {
            Self::SessionServiceError(e) => e.into_response(),
            Self::Unauthorized => (StatusCode::UNAUTHORIZED).into_response(),
        }
    }
}

impl Display for AuthError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl Error for AuthError {}

#[derive(Debug, Clone)] // Copy
pub struct SessionHeader(pub String);

impl Header for SessionHeader {
    fn name() -> &'static HeaderName {
        &X_LUMIUM_SESSION_HEADER_NAME
    }

    fn encode<E: Extend<HeaderValue>>(&self, values: &mut E) {
        let value = HeaderValue::from_str(self.0.as_str()).unwrap();
        values.extend(std::iter::once(value));
    }

    fn decode<'i, I>(values: &mut I) -> Result<Self, axum::headers::Error>
    where
        Self: Sized,
        I: Iterator<Item = &'i HeaderValue>,
    {
        let value = values.next().ok_or_else(axum::headers::Error::invalid)?;
        Ok(SessionHeader(
            value
                .to_str()
                .map_err(|_| axum::headers::Error::invalid())?
                .to_string(),
        ))
    }
}

impl Into<(HeaderName, HeaderValue)> for SessionHeader {
    fn into(self) -> (HeaderName, HeaderValue) {
        (
            HeaderName::from_static(X_LUMIUM_SESSION_HEADER_STRING),
            HeaderValue::from_str(self.0.as_str()).unwrap(),
        )
    }
}

pub async fn auth_guard<T>(
    State(session): State<SessionService>,
    session_header: Option<TypedHeader<SessionHeader>>,
    request: Request<T>,
    next: Next<T>,
) -> Result<Response, AuthError> {
    if let Some(TypedHeader(SessionHeader(session_id))) = session_header {
        session
            .verify(&session_id)
            .await
            .map_err(|e| AuthError::SessionServiceError(e))?;
        Ok(next.run(request).await)
    } else {
        Err(AuthError::Unauthorized)
    }
}
