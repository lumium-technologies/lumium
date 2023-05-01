use crate::services::password::{PasswordService, PasswordServiceError};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::types::Uuid;
use sqlx::{Pool, Postgres};

pub enum ProfileServiceError {
    InternalError,
    PasswordServiceError(PasswordServiceError),
    Unauthorized,
}

impl IntoResponse for ProfileServiceError {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::Unauthorized => (StatusCode::UNAUTHORIZED).into_response(),
            Self::InternalError => (StatusCode::INTERNAL_SERVER_ERROR).into_response(),
            Self::PasswordServiceError(e) => e.into_response(),
        }
    }
}

impl From<sqlx::Error> for ProfileServiceError {
    fn from(_: sqlx::Error) -> Self {
        Self::InternalError
    }
}

impl From<PasswordServiceError> for ProfileServiceError {
    fn from(e: PasswordServiceError) -> Self {
        Self::PasswordServiceError(e)
    }
}

#[derive(Clone)]
pub struct ProfileService {
    database: Pool<Postgres>,
    password: PasswordService,
}

impl ProfileService {
    pub fn new(database: Pool<Postgres>) -> Self {
        let password = PasswordService::new();
        Self { database, password }
    }

    pub async fn create(
        &self,
        email: &str,
        username: &str,
        password: &str,
    ) -> Result<Uuid, ProfileServiceError> {
        let pwd = self.password.create(password)?;

        let result = sqlx::query!(
            r#"WITH profile0 AS (
                INSERT INTO profiles (username, pwd_hash)
                    VALUES ($1, $2)
                    RETURNING id)
            INSERT INTO emails (profile_id, address)
            SELECT id, $3
            FROM profile0
            RETURNING profile_id AS id;"#,
            username,
            pwd,
            email
        )
        .fetch_one(&self.database)
        .await?;

        Ok(result.id)
    }

    pub async fn verify(&self, email: &str, pwd: &str) -> Result<Uuid, ProfileServiceError> {
        let profile = sqlx::query!(
            r#"SELECT p.id AS profile_id, p.pwd_hash AS password_hash
            FROM profiles p JOIN emails e ON p.id = e.profile_id
            WHERE e.address = $1"#,
            email
        )
        .fetch_optional(&self.database)
        .await?;

        if let Some(profile) = profile {
            self.password.verify(pwd, profile.password_hash.as_str())?;

            return Ok(profile.profile_id);
        }

        Err(ProfileServiceError::Unauthorized)
    }
}
