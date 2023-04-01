use axum::extract::{Json, State};
use axum::response::{AppendHeaders, IntoResponse};
use axum_extra::extract::SignedCookieJar;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::services::profile::ProfileService;
use crate::services::session::SessionService;

use super::guard::{SessionHeader, X_LUMIUM_SESSION_HEADER_STRING};

#[derive(Deserialize, ToSchema)]
pub struct SignUp {
    email: String,
    username: String,
    password: String,
}

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
) -> impl IntoResponse {
    let session = session.create(&json.username).await.unwrap();
    AppendHeaders([SessionHeader(session).into()])
}

#[derive(Deserialize, ToSchema)]
pub struct SignIn {
    username_or_email: String,
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
    State(sessions): State<SessionService>,
    State(profiles): State<ProfileService>,
    jar: SignedCookieJar,
    Json(json): Json<SignIn>,
) -> impl IntoResponse {
    // (jar.add(Cookie::new("sid", "hello")), StatusCode::OK)
    // todo!()
}

#[utoipa::path(
    post,
    path = "/v1/auth/signout",
    responses(
        (status = 200, description = "Sign out successful")
    ),
    security(
        ("api_key" = [])
    ),
    tag = "auth"
    )]
pub async fn sign_out(
    State(sessions): State<SessionService>,
    jar: SignedCookieJar,
) -> impl IntoResponse {
    // jar.remove(Cookie::named("sid"))
    // todo!()
}
