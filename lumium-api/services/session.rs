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
    pub fn create() {
        todo!()
    }

    // auth guard
    pub fn find() {
        todo!()
    }

    // signout
    pub fn remove() {
        todo!()
    }

    // password reset
    pub fn remove_all() {
        todo!()
    }
}
