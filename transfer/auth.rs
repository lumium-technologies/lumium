use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema)]
pub struct SignUpDTO {
    pub email: String,
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, ToSchema)]
pub struct SignInDTO {
    pub email: String,
    pub password: String,
}
