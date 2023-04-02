use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::{Pool, Postgres};
use std::error::Error;
use std::fmt::{Display, Formatter};

#[derive(Debug, Clone)]
pub struct SessionServiceError;

impl Display for SessionServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl IntoResponse for SessionServiceError {
    fn into_response(self) -> axum::response::Response {
        (StatusCode::UNAUTHORIZED).into_response()
    }
}

impl Error for SessionServiceError {}

#[derive(Clone)]
pub struct SessionService {
    database: Pool<Postgres>,
}

impl SessionService {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self { database }
    }
}

impl SessionService {
    pub async fn create(&self, user: &str) -> Result<String, SessionServiceError> {
        Ok("thisisasession".to_string())
    }

    pub async fn verify(&self, session: &str) -> Result<String, SessionServiceError> {
        todo!()
    }

    pub async fn delete(&self, session: &str) -> Result<String, SessionServiceError> {
        todo!()
    }

    pub async fn delete_all(&self, user: &str) -> Result<String, SessionServiceError> {
        todo!()
    }
}
