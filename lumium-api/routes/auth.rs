use axum::extract::State;
use axum::response::IntoResponse;

use crate::services::{ProfileService, SessionService};

pub async fn sign_in(
    sessions: State<SessionService>,
    profiles: State<ProfileService>,
) -> impl IntoResponse {
    todo!()
}

pub async fn sign_up(
    sessions: State<SessionService>,
    profiles: State<ProfileService>,
) -> impl IntoResponse {
    todo!()
}

pub async fn sign_out(sessions: State<SessionService>) -> impl IntoResponse {
    todo!()
}
