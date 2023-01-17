use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde_json::json;

pub fn check() -> impl IntoResponse {
    // let _: (i64,) = sqlx::query_as("SELECT $1")
    // .bind(150_i64)
    // .fetch_one(&pool).await?;

    let json = json!({"Hello": "World"});
    (StatusCode::OK, Json(json))
}
