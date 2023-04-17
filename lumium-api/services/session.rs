use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::TypedHeader;
use sqlx::types::{ipnetwork::IpNetwork, Uuid};
use sqlx::{Pool, Postgres};
use std::error::Error;
use std::fmt::{Display, Formatter};
use std::str::FromStr;

use crate::routes::guard::SessionHeader;

#[derive(Debug, Clone)]
pub enum SessionServiceError {
    SessionVerificationError,
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
            Self::SessionVerificationError => (StatusCode::UNAUTHORIZED).into_response(),
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

    pub async fn get_profile(
        &self,
        session_header: TypedHeader<SessionHeader>,
    ) -> Result<String, SessionServiceError> {
        let TypedHeader(SessionHeader(session_id)) = session_header;
        self.verify(&session_id).await
    }

    pub async fn verify(&self, session_id: &str) -> Result<String, SessionServiceError> {
        sqlx::query!("SELECT update_session_secret()")
            .execute(&self.database)
            .await
            .map_err(|_| SessionServiceError::InternalError)?;
        let result = sqlx::query!(
            r#"SELECT profile_id
            FROM sessions
            WHERE session_id = $1
            AND (hmac(session_token,
                  (SELECT s.value
                   FROM session_secrets s
                   WHERE s.status = 'active'),
                  'sha512') = decode($1, 'hex')
                OR hmac(session_token,
                        (SELECT s.value
                         FROM session_secrets s
                         WHERE s.status = 'phase_out'),
                        'sha512') = decode($1, 'hex')
                )"#,
            session_id
        )
        .fetch_optional(&self.database)
        .await
        .map_err(|_| SessionServiceError::InternalError)?;

        if let Some(result) = result {
            if let Some(profile_id) = result.profile_id {
                return Ok(profile_id.to_string());
            }
        }
        Err(SessionServiceError::SessionVerificationError)
    }

    pub async fn destroy(&self, session_id: &str) -> Result<String, SessionServiceError> {
        todo!()
    }

    pub async fn destroy_all(&self, profile_id: &str) -> Result<String, SessionServiceError> {
        todo!()
    }
}
