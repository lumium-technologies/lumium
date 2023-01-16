use axum::{response::Html, routing::get, Router};
use std::{error::Error, net::SocketAddr};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let app = Router::new().route("/", get(handler));

    let addr = SocketAddr::from((
        [127, 0, 0, 1],
        std::env::var("PORT").map_or(5000, |t| t.parse().unwrap()),
    ));
    println!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

async fn handler() -> Html<&'static str> {
    Html("<h1>Hello, World!</h1>")
}
