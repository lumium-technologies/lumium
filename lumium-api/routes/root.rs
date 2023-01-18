use axum::http::StatusCode;
use axum::response::IntoResponse;

pub async fn check() -> impl IntoResponse {
    StatusCode::OK.into_response()
}
