use axum::extract::FromRef;
use axum_extra::extract::cookie::Key;
use sqlx::{Pool, Postgres};

use crate::services::{ProfileService, SessionService};

// TODO impl Debug?
#[derive(Clone)]
pub struct AppState {
    pub profiles: ProfileService,
    pub sessions: SessionService,
    pub secret: Key,
}

impl AppState {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self {
            profiles: ProfileService::new(database.clone()),
            sessions: SessionService::new(database.clone()),
            // TODO I don't think we want to regenerate every time
            secret: Key::generate(),
        }
    }
}

impl FromRef<AppState> for ProfileService {
    fn from_ref(state: &AppState) -> Self {
        state.profiles.clone()
    }
}

impl FromRef<AppState> for SessionService {
    fn from_ref(state: &AppState) -> Self {
        state.sessions.clone()
    }
}

impl FromRef<AppState> for Key {
    fn from_ref(state: &AppState) -> Self {
        state.secret.clone()
    }
}
