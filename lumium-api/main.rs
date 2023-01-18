#![forbid(unsafe_code)]

use std::error::Error;
use std::net::SocketAddr;

use axum::routing::{delete, get, patch, post};
use axum::{middleware, Router, Server};
use sqlx::postgres::PgPoolOptions;

use crate::routes::guard::auth_guard;
use crate::routes::{auth, root, user};

use crate::state::AppState;

mod routes;
mod services;
mod state;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let db = "postgres://development:development@localhost:5432/lumium";
    let db = std::env::var("DATABASE_URL").unwrap_or(db.to_owned());
    let database = PgPoolOptions::new()
        .max_connections(5)
        .connect(db.as_str())
        .await?;

    sqlx::migrate!("./migrations").run(&database).await?;

    let state = AppState::new(database);

    let guard = middleware::from_fn_with_state(state.clone(), auth_guard);

    let root = Router::new().route("/", get(root::check));

    let auth = Router::new()
        .route("/signout", post(auth::sign_out))
        .route_layer(guard.clone())
        .route("/signup", post(auth::sign_up))
        .route("/signin", post(auth::sign_in))
        .with_state(state.clone());

    let user = Router::new()
        .route("/profile", get(user::get_profile))
        .route("/profile", delete(user::delete_profile))
        .route("/profile/username", patch(user::update_username))
        .route("/profile/password", patch(user::update_password))
        .route("/profile/email", patch(user::update_email))
        .route("/profile/email", post(user::create_email))
        .route("/profile/email", delete(user::delete_email))
        .route_layer(guard.clone())
        .with_state(state);

    let app = Router::new().merge(root).merge(auth).merge(user);

    let port = std::env::var("PORT").map_or(5000, |t| t.parse().unwrap());
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    println!("listening on {addr}");

    Server::bind(&addr).serve(app.into_make_service()).await?;

    Ok(())
}
