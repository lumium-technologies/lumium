use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::types::{ipnetwork::IpNetwork, Uuid};
use sqlx::{Pool, Postgres};
use std::error::Error;
use std::fmt::{Display, Formatter};
use std::str::FromStr;

#[derive(Debug, Clone)]
pub enum SessionServiceError {
    InternalError,
}

impl Display for SessionServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl IntoResponse for SessionServiceError {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::InternalError => (StatusCode::INTERNAL_SERVER_ERROR).into_response(),
        }
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

    pub async fn create(&self, user: &str) -> Result<String, SessionServiceError> {
        let profile_id = Uuid::from_str(user).map_err(|_| SessionServiceError::InternalError)?;
        let user_agent = "".to_string();
        let ip_address =
            IpNetwork::from_str("0.0.0.0").map_err(|_| SessionServiceError::InternalError)?;
        let session_id = sqlx::query!(
            r#"INSERT INTO sessions 
            (profile_id, ip_address, user_agent)
            VALUES 
            ($1, $2, $3)
            RETURNING session_id"#,
            profile_id,
            ip_address,
            user_agent
        )
        .fetch_one(&self.database)
        .await
        .map_err(|_| SessionServiceError::InternalError)?
        .session_id;

        Ok(session_id)
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
