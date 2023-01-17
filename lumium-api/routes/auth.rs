use axum::extract::{Json, State};
use axum::response::IntoResponse;
use axum_extra::extract::SignedCookieJar;
use serde::Deserialize;

use crate::services::{ProfileService, SessionService};

#[derive(Deserialize)]
pub struct SignUp {
    email: String,
    username: String,
    password: String,
}

// 201, 401
pub async fn sign_up(
    sessions: State<SessionService>,
    profiles: State<ProfileService>,
    Json(json): Json<SignUp>,
    // TypedHeader(auth): TypedHeader<Authorization<Bearer>>,
    // jar: SignedCookieJar,
) -> impl IntoResponse {
    todo!()
}

#[derive(Deserialize)]
pub struct SignInWithUsername {
    username: String,
    password: String,
}

// 200, 400
pub async fn sign_in_username(
    sessions: State<SessionService>,
    profiles: State<ProfileService>,
    Json(json): Json<SignInWithUsername>,
) -> impl IntoResponse {
    todo!()
}

#[derive(Deserialize)]
pub struct SignInWithEmail {
    email: String,
    password: String,
}

// 200, 400
pub async fn sign_in_email(
    sessions: State<SessionService>,
    profiles: State<ProfileService>,
    Json(json): Json<SignInWithEmail>,
) -> impl IntoResponse {
    todo!()
}

// 200, 401
pub async fn sign_out(sessions: State<SessionService>) -> impl IntoResponse {
    todo!()
}
