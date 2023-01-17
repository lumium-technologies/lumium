use axum::extract::FromRef;
use sqlx::{Pool, Postgres};

use crate::services::{ProfileService, SessionService};

#[derive(Debug, Clone)]
pub struct AppState {
    pub profiles: ProfileService,
    pub sessions: SessionService,
}

impl AppState {
    pub fn new(database: Pool<Postgres>) -> Self {
        let profiles = ProfileService::new(database.clone());
        let sessions = SessionService::new(database.clone());
        Self { profiles, sessions }
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
