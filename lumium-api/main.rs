use std::{error::Error, net::SocketAddr};

use axum::extract::State;
use axum::{middleware, routing::post, Router, Server};
use sqlx::postgres::PgPoolOptions;

use crate::routes::auth::*;
use crate::routes::guard::*;
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
    let guard = middleware::from_fn_with_state(state.sessions.clone(), auth_guard);

    let app = Router::new()
        .route("/signout", post(sign_out))
        .route_layer(guard)
        .route("/signup", post(sign_up))
        .route("/signin", post(sign_in_username))
        .route("/signin", post(sign_in_email))
        .with_state(state.clone());

    let port = std::env::var("PORT").map_or(5000, |t| t.parse().unwrap());
    let addr = SocketAddr::from(([127, 0, 0, 1], port));

    println!("listening on {}", addr);
    Server::bind(&addr).serve(app.into_make_service()).await?;

    Ok(())
}
