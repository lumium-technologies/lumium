use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::postgres::types::PgInterval;
use sqlx::types::{ipnetwork::IpNetwork, Uuid};
use sqlx::{Pool, Postgres};
use std::error::Error;
use std::fmt::{Display, Formatter};
use std::str::FromStr;
use std::time::Duration;

const SESSION_SECRET_TTL_SECONDS: u64 = 43200;

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

    async fn roll_session_secret(&self) -> Result<String, SessionServiceError> {
        let mut tx = Pool::begin(&self.database)
            .await
            .map_err(|_| SessionServiceError::InternalError)?;
        sqlx::query!("UPDATE session_secrets SET status = 'inactive' WHERE status = 'phase_out'")
            .execute(&mut tx)
            .await
            .map_err(|_| SessionServiceError::InternalError)?;
        sqlx::query!("UPDATE session_secrets SET status = 'phase_out' WHERE status = 'active'")
            .execute(&mut tx)
            .await
            .map_err(|_| SessionServiceError::InternalError)?;
        let session = sqlx::query!("INSERT INTO session_secrets DEFAULT VALUES RETURNING value")
            .fetch_one(&mut tx)
            .await
            .map_err(|_| SessionServiceError::InternalError)?
            .value;

        tx.commit()
            .await
            .map_err(|_| SessionServiceError::InternalError)?;

        Ok(session)
    }

    pub async fn create(&self, user: &str) -> Result<String, SessionServiceError> {
        let mut tx = Pool::begin(&self.database)
            .await
            .map_err(|_| SessionServiceError::InternalError)?;
        let active_session_secret = match sqlx::query!(
            r#"SELECT value FROM session_secrets
            WHERE status = 'active' AND
            ((NOW() - issued_at) < $1)"#,
            PgInterval::try_from(Duration::new(SESSION_SECRET_TTL_SECONDS, 0))
                .map_err(|_| SessionServiceError::InternalError)?
        )
        .fetch_optional(&mut tx)
        .await
        .map_err(|_| SessionServiceError::InternalError)?
        {
            Some(session_secret) => session_secret.value,
            None => self.roll_session_secret().await?,
        };
        let profile_id = Uuid::from_str(user).map_err(|_| SessionServiceError::InternalError)?;
        let session = "".to_string();
        let user_agent = "".to_string();
        let ip_address =
            IpNetwork::from_str("0.0.0.0").map_err(|_| SessionServiceError::InternalError)?;
        sqlx::query!(
            r#"INSERT INTO sessions 
            (profile_id, session_token, ip_address, user_agent)
            VALUES 
            ($1, $2, $3, $4)"#,
            profile_id,
            session,
            ip_address,
            user_agent
        )
        .execute(&mut tx)
        .await
        .map_err(|_| SessionServiceError::InternalError)?;

        tx.commit()
            .await
            .map_err(|_| SessionServiceError::InternalError)?;

        Ok(session)
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
