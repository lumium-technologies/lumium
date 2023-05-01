use std::net::SocketAddr;

use axum::extract::{ConnectInfo, Json, State};
use axum::headers::UserAgent;
use axum::response::{AppendHeaders, IntoResponse, Response};
use axum::TypedHeader;

use crate::services::profile::{ProfileService, ProfileServiceError};
use crate::services::session::{SessionService, SessionServiceError};
use crate::transfer::auth::{SignInDTO, SignUpDTO};

use axum::headers::{Header, HeaderName};
use axum::http::{HeaderValue, Request, StatusCode};
use axum::middleware::Next;

use crate::transfer::constants::X_LUMIUM_SESSION_HEADER;

static X_LUMIUM_SESSION_HEADER_NAME: HeaderName = HeaderName::from_static(X_LUMIUM_SESSION_HEADER);

pub enum AuthError {
    SessionServiceError(SessionServiceError),
    ProfileServiceError(ProfileServiceError),
    Unauthorized,
}

impl IntoResponse for AuthError {
    fn into_response(self) -> Response {
        match self {
            Self::SessionServiceError(e) => e.into_response(),
            Self::ProfileServiceError(e) => e.into_response(),
            Self::Unauthorized => StatusCode::UNAUTHORIZED.into_response(),
        }
    }
}

impl From<SessionServiceError> for AuthError {
    fn from(e: SessionServiceError) -> Self {
        Self::SessionServiceError(e)
    }
}

impl From<ProfileServiceError> for AuthError {
    fn from(e: ProfileServiceError) -> Self {
        Self::ProfileServiceError(e)
    }
}

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
) -> Result<impl IntoResponse, AuthError> {
    let profile_id = profile
        .create(&json.email, &json.username, &json.password)
        .await?;
    let session = session
        .create(profile_id, addr.ip(), user_agent.as_str())
        .await?;
    Ok(AppendHeaders([SessionHeader(session).into()]))
}

#[utoipa::path(
    post,
    path = "/v1/auth/signin",
    request_body = SignInDTO,
    responses(
        (status = 200, description = "Sign in successful"),
        (status = 401, description = "Unauthorized")
    ),
    tag = "auth"
)]
pub async fn sign_in(
    State(session): State<SessionService>,
    State(profile): State<ProfileService>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    TypedHeader(user_agent): TypedHeader<UserAgent>,
    Json(json): Json<SignInDTO>,
) -> Result<impl IntoResponse, AuthError> {
    let profile_id = profile.verify(&json.email, &json.password).await?;
    let session = session
        .create(profile_id, addr.ip(), user_agent.as_str())
        .await?;
    Ok(AppendHeaders([SessionHeader(session).into()]))
}

#[utoipa::path(
    post,
    path = "/v1/auth/signout",
    responses(
        (status = 200, description = "Sign out successful"),
        (status = 401, description = "Unauthorized")
    ),
    security(
        ("Lumium Session" = [])
    ),
    tag = "auth"
    )]
pub async fn sign_out(
    State(session): State<SessionService>,
    session_header: TypedHeader<SessionHeader>,
) -> Result<impl IntoResponse, AuthError> {
    let TypedHeader(SessionHeader(session_id)) = session_header;
    session.destroy(&session_id).await?;

    Ok(())
}

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
            HeaderName::from_static(X_LUMIUM_SESSION_HEADER),
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
        session.verify(&session_id).await?;
        Ok(next.run(request).await)
    } else {
        Err(AuthError::Unauthorized)
    }
}
