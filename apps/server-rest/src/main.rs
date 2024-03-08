mod env_values;
mod routers;

use axum::{routing::get, Router};
use sqlx::postgres::PgPoolOptions;
use tower_http::cors::CorsLayer;

#[derive(Clone, axum::extract::FromRef)]
pub struct AppState {
    pg_pool: sqlx::PgPool,
}

#[tokio::main]
async fn main() -> Result<(), lambda_http::Error> {
    let db_connection_str = std::env::var(env_values::DATABASE_URL).unwrap();

    let pg_pool = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(std::time::Duration::from_secs(3))
        .connect(&db_connection_str)
        .await
        .expect("can't connect to database");

    let state = AppState { pg_pool };

    let cors = CorsLayer::new()
        .allow_methods([
            http::Method::GET,
            http::Method::POST,
            http::Method::PUT,
            http::Method::PATCH,
            http::Method::OPTIONS,
            http::Method::DELETE,
        ])
        .allow_headers([
            http::header::ACCESS_CONTROL_ALLOW_CREDENTIALS,
            http::header::ACCESS_CONTROL_ALLOW_HEADERS,
            http::header::ACCESS_CONTROL_REQUEST_HEADERS,
            http::header::ACCESS_CONTROL_REQUEST_METHOD,
            http::header::CONTENT_TYPE,
        ])
        .allow_origin(
            std::env::var(env_values::WEB_CLIENT_URL)
                .unwrap()
                .parse::<http::HeaderValue>()
                .unwrap(),
        )
        .allow_credentials(true);

    let app = Router::new()
        .route("/", get(routers::root::get_hello_world::handler))
        .layer(cors)
        .with_state(state);

    lambda_http::run(app).await
}
