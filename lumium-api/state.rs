use axum::extract::FromRef;
use axum_extra::extract::cookie::Key;
use sqlx::{Pool, Postgres};

use crate::services::profile::ProfileService;
use crate::services::session::SessionService;

#[derive(Clone)]
pub struct AppState {
    secret: Key,
    session: SessionService,
    profile: ProfileService,
}

impl AppState {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self {
            secret: Key::generate(),
            session: SessionService::new(database.clone()),
            profile: ProfileService::new(database.clone()),
        }
    }
}

macro_rules! impl_di {
    ($($t:ty: $f:ident),+) => {$(
        impl FromRef<AppState> for $t {
            fn from_ref(state: &AppState) -> Self {
                state.$f.clone()
            }
        }
    )+};
}

impl_di!(Key: secret);
impl_di!(SessionService: session);
impl_di!(ProfileService: profile);
