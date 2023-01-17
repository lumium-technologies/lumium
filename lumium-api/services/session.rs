use sqlx::{Pool, Postgres};

#[derive(Debug, Clone)]
pub struct SessionService {
    database: Pool<Postgres>,
}

impl SessionService {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self { database }
    }
}

impl SessionService {
    // signup & signin
    pub async fn create() {
        todo!()
    }

    // auth guard
    pub async fn find() {
        todo!()
    }

    // signout
    pub async fn remove() {
        todo!()
    }

    // password reset
    pub async fn remove_all() {
        todo!()
    }
}
