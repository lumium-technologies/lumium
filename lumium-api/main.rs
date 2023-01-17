use std::{error::Error, net::SocketAddr};

use axum::extract::State;
use axum::{middleware, routing::post, Router, Server};
use sqlx::postgres::PgPoolOptions;

use crate::state::AppState;

mod routes;
mod services;
mod state;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let db = std::env::var("DATABASE_URL")
        .unwrap_or("postgres://postgres:postgrespw@localhost:55000".to_owned());
    let database = PgPoolOptions::new()
        .max_connections(5)
        .connect(db.as_str())
        .await?;

    let state = AppState::new(database.clone());
    let guard = middleware::from_fn_with_state(state.sessions.clone(), routes::guard::auth_guard);

    let app = Router::new()
        .route("/signout", post(routes::auth::sign_out))
        .route_layer(guard)
        .route("/signup", post(routes::auth::sign_up))
        .route("/signin", post(routes::auth::sign_in))
        .with_state(state.clone());

    let port = std::env::var("PORT").map_or(5000, |t| t.parse().unwrap());
    let addr = SocketAddr::from(([127, 0, 0, 1], port));

    println!("listening on {}", addr);
    Server::bind(&addr).serve(app.into_make_service()).await?;

    Ok(())
}

// let _: (i64,) = sqlx::query_as("SELECT $1")
// .bind(150_i64)
// .fetch_one(&pool).await?;
