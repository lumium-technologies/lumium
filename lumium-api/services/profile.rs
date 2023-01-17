use sqlx::{Pool, Postgres};
use sqlx::types::Uuid;

#[derive(Debug, Clone)]
pub struct ProfileService {
    database: Pool<Postgres>,
}

impl ProfileService {
    pub fn new(database: Pool<Postgres>) -> Self {
        Self { database }
    }
}

pub struct ProfileID(pub Uuid);

impl ProfileService {
    pub async fn create(&self, email: &str, username: &str, password: &str) {
        let pwd_hash = password; // TODO
        let result = sqlx::query!(
            r#"
            SELECT FROM emails
            WHERE address = $1;
        "#,
            email
        );

        let result = sqlx::query!(
            r#"
            INSERT INTO profiles (username, pwd_hash)
            VALUES ($1, $2)
            RETURNING id
        "#,
            username,
            pwd_hash
        )
            .fetch_one(&self.database)
            .await;

        todo!()
    }

    pub async fn verify_email(&self, email: &str, password: &str) {
        todo!()
    }

    pub async fn verify_username(&self, username: &str, password: &str) {
        let pwd_hash = password; // TODO
        let result = sqlx::query!(
            r#"
            SELECT id
            FROM profiles
            WHERE username = $1 AND pwd_hash = $2;
        "#,
            username,
            pwd_hash
        )
            .fetch_optional(&self.database)
            .await;

        todo!()
    }

    pub async fn update_email(&self, old_email: &str, new_email: &str) {
        todo!()
    }

    pub async fn update_username(&self, username: &str, password: &str) {
        todo!()
    }

    pub async fn update_password(&self, old_password: &str, new_password: &str) {
        todo!()
    }
}
