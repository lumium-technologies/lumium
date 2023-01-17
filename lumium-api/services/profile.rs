use sqlx::{Pool, Postgres};

#[derive(Debug, Clone)]
pub struct ProfileService {
    database: Pool<Postgres>,
}

impl ProfileService {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self { database }
    }
}

impl ProfileService {
    pub fn create(&self, username: &str, password: &str) {
        todo!()
    }

    pub fn verify(&self, username: &str, password: &str) {
        todo!()
    }

    pub fn update_username(&self, username: &str, password: &str) {
        todo!()
    }

    pub fn update_password(&self, old_password: &str, new_password: &str) {
        todo!()
    }
}
