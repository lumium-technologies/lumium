#![forbid(unsafe_code)]

use std::env::var_os;
use std::error::Error;
use std::net::{Ipv4Addr, SocketAddr};

use axum::http::HeaderValue;
use axum::routing::{delete, get, patch, post, put};
use axum::{middleware, Router, Server};
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use tower_http::cors::{AllowOrigin, CorsLayer};
use utoipa::openapi::security::{ApiKey, ApiKeyValue, SecurityScheme};
use utoipa::{Modify, OpenApi};
use utoipa_swagger_ui::SwaggerUi;

use crate::routes::guard::auth_guard;
use crate::routes::{auth, profile, workspace};

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
        auth::sign_out,
        workspace::create_workspace
    ),
    components(
        schemas(
            transfer::auth::SignUpDTO,
            transfer::auth::SignInDTO,
            transfer::workspace::WorkspaceCreateDTO,
            transfer::workspace::WorkspaceDTOEncrypted,
            transfer::e2ekeys::E2EKeyCreateDTO
        )
    ),
    modifiers(&SecurityAddon),
    tags(
        (name = "auth", description = "Authentication API"),
        (name = "workspace", description = "Workspace Management API")
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

    let auth = Router::new()
        .route(API_V1_AUTH_SIGNOUT, post(auth::sign_out))
        .route_layer(guard.clone())
        .route(API_V1_AUTH_SIGNUP, post(auth::sign_up))
        .route(API_V1_AUTH_SIGNIN, post(auth::sign_in))
        .with_state(state.clone());

    let profile = Router::new()
        .route(API_V1_PROFILE, get(profile::get_profile))
        .route(API_V1_PROFILE, delete(profile::delete_profile))
        .route(API_V1_PROFILE_USERNAME, patch(profile::update_username))
        .route(API_V1_PROFILE_PASSWORD, patch(profile::update_password))
        .route(API_V1_PROFILE_EMAIL, patch(profile::update_email))
        .route(API_V1_PROFILE_EMAIL, post(profile::create_email))
        .route(API_V1_PROFILE_EMAIL, delete(profile::delete_email))
        .route_layer(guard.clone())
        .with_state(state.clone());

    let workspace = Router::new()
        .route(API_V1_WORKSPACE, put(workspace::create_workspace))
        .route_layer(guard.clone())
        .with_state(state.clone());

    let origins = config
        .origins
        .iter()
        .map(|t| HeaderValue::from_str(t).unwrap());

    let app = Router::new()
        .merge(SwaggerUi::new(API_V1_DOCS).url("/api-docs/openapi.json", ApiDoc::openapi()))
        .merge(auth)
        .merge(profile)
        .merge(workspace)
        .layer(CorsLayer::permissive().allow_origin(AllowOrigin::list(origins)));

    let port = std::env::var("PORT").map_or(5000, |t| t.parse().unwrap());
    let addr = SocketAddr::from((Ipv4Addr::UNSPECIFIED, port));
    println!("listening on {addr}");

    Server::bind(&addr)
        .serve(app.into_make_service_with_connect_info::<SocketAddr>())
        .await?;

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
