use axum::extract::{Json, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum_extra::extract::cookie::Cookie;
use axum_extra::extract::SignedCookieJar;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::services::profile::ProfileService;
use crate::services::session::SessionService;

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
    State(sessions): State<SessionService>,
    State(profiles): State<ProfileService>,
    jar: SignedCookieJar,
    Json(json): Json<SignUp>,
) -> impl IntoResponse {
    todo!()
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
