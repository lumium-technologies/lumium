use crate::services::password::{PasswordService, PasswordServiceError};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use sqlx::types::Uuid;
use sqlx::Error as SqlxError;
use sqlx::{Pool, Postgres};
use std::error::Error;
use std::fmt::{Display, Formatter};

#[derive(Debug)]
pub enum ProfileServiceError {
    InternalError(Option<SqlxError>),
    PasswordServiceError(PasswordServiceError),
    NotFound,
    WrongPassword,
}

impl Display for ProfileServiceError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl IntoResponse for ProfileServiceError {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::NotFound => (StatusCode::NOT_FOUND).into_response(),
            Self::WrongPassword => (StatusCode::UNAUTHORIZED).into_response(),
            Self::InternalError(_) => (StatusCode::INTERNAL_SERVER_ERROR).into_response(),
            Self::PasswordServiceError(e) => e.into_response(),
        }
    }
}

impl Error for ProfileServiceError {}

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
}

impl ProfileService {
    pub async fn create(
        &self,
        email: &str,
        username: &str,
        password: &str,
    ) -> Result<String, ProfileServiceError> {
        let pwd = self.password.create(password);
        let pwd = pwd.map_err(|e| ProfileServiceError::PasswordServiceError(e))?;

        let result = sqlx::query!(
            r#"WITH profile0 AS (
                INSERT INTO profiles (username, pwd_hash)
                    VALUES ($1, $2)
                    RETURNING id)
            INSERT
            INTO emails (profile_id, address)
            SELECT id, $3
            FROM profile0
            RETURNING profile_id AS id;"#,
            username,
            pwd,
            email
        )
        .fetch_one(&self.database)
        .await;

        let result = result.map_err(|e| ProfileServiceError::InternalError(Some(e)))?;
        Ok(result.id.to_string())
    }
}

impl ProfileService {
    pub async fn update(&self) -> Result<String, ProfileServiceError> {
        todo!()
    }
}

#[derive(Debug)]
struct VerifyQuery {
    id: Uuid,
    pwd_hash: String,
}

pub enum VerifyOn<'a> {
    Username(&'a str),
    Email(&'a str),
}

impl ProfileService {
    pub async fn verify(&self, pwd: &str, vo: VerifyOn<'_>) -> Result<String, ProfileServiceError> {
        let r = match vo {
            VerifyOn::Username(u) => self.q_verify_by_name(u).await,
            VerifyOn::Email(e) => self.q_verify_by_mail(e).await,
        };

        let r = r.map_err(|e| ProfileServiceError::InternalError(Some(e)))?;
        let r = r.ok_or_else(|| ProfileServiceError::NotFound)?;
        let s = self.password.verify(pwd, r.pwd_hash.as_str());
        let s = s.map_err(|e| ProfileServiceError::PasswordServiceError(e))?;
        match s {
            false => Err(ProfileServiceError::WrongPassword),
            true => Ok(r.id.to_string()),
        }
    }

    async fn q_verify_by_name(&self, username: &str) -> Result<Option<VerifyQuery>, SqlxError> {
        sqlx::query_as!(
            VerifyQuery,
            r#"SELECT id, pwd_hash
            FROM profiles
            WHERE username = $1;"#,
            username
        )
        .fetch_optional(&self.database)
        .await
    }

    async fn q_verify_by_mail(&self, email: &str) -> Result<Option<VerifyQuery>, SqlxError> {
        sqlx::query_as!(
            VerifyQuery,
            r#"SELECT profiles.id, pwd_hash
            FROM profiles JOIN emails
                ON profiles.id = emails.profile_id
            WHERE emails.address = $1;"#,
            email
        )
        .fetch_optional(&self.database)
        .await
    }
}

impl ProfileService {
    pub async fn delete(&self) -> Result<String, ProfileServiceError> {
        todo!()
    }
}
