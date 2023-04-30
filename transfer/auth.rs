use serde::{Deserialize, Serialize};
use tsify::Tsify;
use utoipa::ToSchema;

#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
pub struct SignUpDTO {
    pub email: String,
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, ToSchema, Tsify, Clone)]
pub struct SignInDTO {
    pub email: String,
    pub password: String,
}
