use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::TypedHeader;
use sqlx::types::ipnetwork::IpNetwork;
use sqlx::types::Uuid;
use sqlx::{Error, Pool, Postgres};
use std::str::FromStr;

use crate::routes::guard::SessionHeader;

#[derive(Clone)]
pub struct SessionService {
    database: Pool<Postgres>,
}

#[derive(Debug, Clone)]
pub enum SessionServiceError {
    SessionVerificationError,
    InternalError,
}

impl IntoResponse for SessionServiceError {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::SessionVerificationError => (StatusCode::UNAUTHORIZED).into_response(),
            Self::InternalError => (StatusCode::INTERNAL_SERVER_ERROR).into_response(),
        }
    }
}

impl From<Error> for SessionServiceError {
    fn from(_: Error) -> Self {
        Self::InternalError
    }
}

impl From<sqlx::types::uuid::Error> for SessionServiceError {
    fn from(_: sqlx::types::uuid::Error) -> Self {
        Self::InternalError
    }
}

impl SessionService {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self { database }
    }

    pub async fn create(
        &self,
        user: &str,
        ip_addr: &str,
        user_agent: &str,
    ) -> Result<String, SessionServiceError> {
        let mut tx = self.database.begin().await?;
        sqlx::query!("SELECT update_session_secret()")
            .execute(&mut tx)
            .await?;
        let profile_id = Uuid::from_str(user)?;
        let ip_addr =
            IpNetwork::from_str(ip_addr).map_err(|_| SessionServiceError::InternalError)?;
        let session_id = sqlx::query!(
            r#"INSERT INTO sessions 
            (profile_id, ip_address, user_agent)
            VALUES 
            ($1, $2, $3)
            RETURNING session_id"#,
            profile_id,
            ip_addr,
            user_agent
        )
        .fetch_one(&mut tx)
        .await?
        .session_id;

        tx.commit()
            .await
            .map_err(|_| SessionServiceError::InternalError)?;

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
        let mut tx = self.database.begin().await?;
        sqlx::query!("SELECT update_session_secret()")
            .execute(&mut tx)
            .await?;
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
        .fetch_optional(&mut tx)
        .await?;
        tx.commit().await?;

        if let Some(result) = result {
            return Ok(result.profile_id.to_string());
        }
        Err(SessionServiceError::SessionVerificationError)
    }

    pub async fn destroy(&self, session_id: &str) -> Result<(), SessionServiceError> {
        sqlx::query!(
            r#"DELETE FROM sessions
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
        .execute(&self.database)
        .await?;

        Ok(())
    }

    pub async fn destroy_all(&self, profile_id: &str) -> Result<(), SessionServiceError> {
        sqlx::query!(
            r#"DELETE FROM sessions
            WHERE profile_id = $1
            AND (hmac(session_token,
                  (SELECT s.value
                   FROM session_secrets s
                   WHERE s.status = 'active'),
                  'sha512') = decode(session_id, 'hex')
                OR hmac(session_token,
                        (SELECT s.value
                         FROM session_secrets s
                         WHERE s.status = 'phase_out'),
                        'sha512') = decode(session_id, 'hex')
                )"#,
            Uuid::from_str(profile_id).map_err(|_| SessionServiceError::InternalError)?
        )
        .execute(&self.database)
        .await?;

        Ok(())
    }
}
