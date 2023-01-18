use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::Error as ArgonError;
use argon2::password_hash::SaltString;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use std::error::Error;
use std::fmt::{Display, Formatter};

#[derive(Debug, Clone)]
pub struct PasswordSrvError(pub ArgonError);

impl Display for PasswordSrvError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

impl Error for PasswordSrvError {}

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
    pub fn create(&self, pwd: &str) -> Result<String, PasswordSrvError> {
        let salt = &SaltString::generate(&mut OsRng);
        let hash = self.argon.hash_password(pwd.as_bytes(), salt);
        hash.map(|h| h.to_string()).map_err(|e| PasswordSrvError(e))
    }

    pub fn verify(&self, pwd: &str, hash: &str) -> Result<bool, PasswordSrvError> {
        let hash = PasswordHash::new(&hash);
        let hash = hash.map_err(|e| PasswordSrvError(e))?;
        let res = self.argon.verify_password(pwd.as_bytes(), &hash);

        if let Err(e) = res {
            return match e {
                ArgonError::Password => Ok(false),
                _ => Err(PasswordSrvError(e)),
            };
        }

        Ok(true)
    }
}
