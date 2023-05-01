use axum::extract::FromRef;
use sqlx::{Pool, Postgres};

use crate::services::profile::ProfileService;
use crate::services::session::SessionService;
use crate::services::workspace::WorkspaceService;

#[derive(Clone)]
pub struct AppState {
    session: SessionService,
    profile: ProfileService,
    workspace: WorkspaceService,
}

impl AppState {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self {
            session: SessionService::new(database.clone()),
            profile: ProfileService::new(database.clone()),
            workspace: WorkspaceService::new(database.clone()),
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

impl_di!(SessionService: session);
impl_di!(ProfileService: profile);
impl_di!(WorkspaceService: workspace);
