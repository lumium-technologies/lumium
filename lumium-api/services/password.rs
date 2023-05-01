use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::Error as ArgonError;
use argon2::password_hash::SaltString;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::http::StatusCode;
use axum::response::IntoResponse;

pub enum PasswordServiceError {
    VerificationError,
    InternalError,
}

impl IntoResponse for PasswordServiceError {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::VerificationError => (StatusCode::UNAUTHORIZED).into_response(),
            Self::InternalError => (StatusCode::INTERNAL_SERVER_ERROR).into_response(),
        }
    }
}

#[derive(Clone)]
pub struct PasswordService {
    argon: Argon2<'static>,
}

impl PasswordService {
    pub fn new() -> Self {
        Self {
            argon: Argon2::default(),
        }
    }
}

impl PasswordService {
    pub fn create(&self, pwd: &str) -> Result<String, PasswordServiceError> {
        let salt = &SaltString::generate(&mut OsRng);
        let hash = self.argon.hash_password(pwd.as_bytes(), salt);
        hash.map(|h| h.to_string())
            .map_err(|_| PasswordServiceError::InternalError)
    }

    pub fn verify(&self, pwd: &str, hash: &str) -> Result<(), PasswordServiceError> {
        let hash = PasswordHash::new(&hash);
        let hash = hash.map_err(|_| PasswordServiceError::InternalError)?;
        let res = self.argon.verify_password(pwd.as_bytes(), &hash);

        if let Err(e) = res {
            return match e {
                ArgonError::Password => Err(PasswordServiceError::VerificationError),
                _ => Err(PasswordServiceError::InternalError),
            };
        }

        Ok(())
    }
}
