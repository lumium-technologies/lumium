#![forbid(unsafe_code)]

use std::env::var_os;
use std::error::Error;
use std::net::{Ipv4Addr, SocketAddr};

use axum::http::HeaderValue;
use axum::routing::{delete, get, patch, post};
use axum::{middleware, Router, Server};
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use tower_http::cors::{AllowOrigin, CorsLayer};
use utoipa::openapi::security::{ApiKey, ApiKeyValue, SecurityScheme};
use utoipa::{Modify, OpenApi};
use utoipa_swagger_ui::SwaggerUi;

use crate::routes::guard::auth_guard;
use crate::routes::{auth, root, user};

use crate::state::AppState;

mod routes;
mod services;
mod state;
mod transfer;

use crate::transfer::constants::*;

const PRODUCTION_ENV: &str = "PRODUCTION";
const ENVIRONMENT_ENV: &str = "ENVIRONMENT";
const CARGO_TEST_ENV: &str = "CARGO_TEST";
const DATABASE_URL_ENV: &str = "DATABASE_URL";
const SPACE_HOST_ENV: &str = "SPACE_HOST";
const API_HOST_ENV: &str = "API_HOST";
const ENV_DEVELOPMENT_VAL: &str = "development";
const ENV_TEST_VAL: &str = "test";

#[derive(OpenApi)]
#[openapi(
    paths(
        auth::sign_up,
        auth::sign_in,
        auth::sign_out
    ),
    components(
        schemas(
            transfer::auth::SignUpDTO,
            transfer::auth::SignInDTO
        )
    ),
    modifiers(&SecurityAddon),
    tags(
        (name = "auth", description = "Authentication API")
    )
)]
struct ApiDoc;

struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "Lumium Session",
                SecurityScheme::ApiKey(ApiKey::Header(ApiKeyValue::new(X_LUMIUM_SESSION_HEADER))),
            )
        }
    }
}

struct AppConfig {
    database: Pool<Postgres>,
    origins: Vec<String>,
}

async fn run(config: AppConfig) -> Result<(), Box<dyn Error>> {
    let state = AppState::new(config.database);

    let guard = middleware::from_fn_with_state(state.clone(), auth_guard);

    let root = Router::new().route("/v1/", get(root::check));

    let auth = Router::new()
        .route(SIGNOUT, post(auth::sign_out))
        .route_layer(guard.clone())
        .route(SIGNUP, post(auth::sign_up))
        .route(SIGNIN, post(auth::sign_in))
        .with_state(state.clone());

    let user = Router::new()
        .route(PROFILE, get(user::get_profile))
        .route(PROFILE, delete(user::delete_profile))
        .route(USERNAME, patch(user::update_username))
        .route(PASSWORD, patch(user::update_password))
        .route(EMAIL, patch(user::update_email))
        .route(EMAIL, post(user::create_email))
        .route(EMAIL, delete(user::delete_email))
        .route_layer(guard.clone())
        .with_state(state);

    let origins = config
        .origins
        .iter()
        .map(|t| HeaderValue::from_str(t).unwrap());

    let app = Router::new()
        .merge(SwaggerUi::new(DOCS).url("/api-docs/openapi.json", ApiDoc::openapi()))
        .merge(root)
        .merge(auth)
        .merge(user)
        .layer(CorsLayer::permissive().allow_origin(AllowOrigin::list(origins)));

    let port = std::env::var("PORT").map_or(5000, |t| t.parse().unwrap());
    let addr = SocketAddr::from((Ipv4Addr::UNSPECIFIED, port));
    println!("listening on {addr}");

    Server::bind(&addr).serve(app.into_make_service()).await?;

    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    if std::env::var(PRODUCTION_ENV).is_err() {
        let mut env = ENV_DEVELOPMENT_VAL.to_string();
        if let Ok(val) = std::env::var(ENVIRONMENT_ENV) {
            env = val;
        };
        if var_os(CARGO_TEST_ENV).is_some() {
            env = ENV_TEST_VAL.to_string();
        }
        dotenvy::from_filename(format!(".env.{}", env))?;
    }
    let db = std::env::var(DATABASE_URL_ENV)?;
    let database = PgPoolOptions::new()
        .max_connections(20)
        .connect(db.as_str())
        .await?;

    sqlx::migrate!("./migrations").run(&database).await?;

    let origins = vec![std::env::var(SPACE_HOST_ENV)?, std::env::var(API_HOST_ENV)?];

    let config = AppConfig { database, origins };

    run(config).await
}
