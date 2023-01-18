use axum::extract::{Json, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum_extra::extract::cookie::Cookie;
use axum_extra::extract::SignedCookieJar;
use serde::Deserialize;

use crate::services::profile::ProfileService;
use crate::services::session::SessionService;

#[derive(Deserialize)]
pub struct SignUp {
    email: String,
    username: String,
    password: String,
}

pub async fn sign_up(
    State(sessions): State<SessionService>,
    State(profiles): State<ProfileService>,
    jar: SignedCookieJar,
    Json(json): Json<SignIn>,
) -> impl IntoResponse {
    todo!()
}

#[derive(Deserialize)]
pub struct SignIn {
    username_or_email: String,
    password: String,
}

pub async fn sign_in(
    State(sessions): State<SessionService>,
    State(profiles): State<ProfileService>,
    jar: SignedCookieJar,
    Json(json): Json<SignIn>,
) -> impl IntoResponse {
    // (jar.add(Cookie::new("sid", "hello")), StatusCode::OK)
    // todo!()
}

pub async fn sign_out(
    State(sessions): State<SessionService>,
    jar: SignedCookieJar,
) -> impl IntoResponse {
    // jar.remove(Cookie::named("sid"))
    // todo!()
}
