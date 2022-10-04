fn main() {
    let filename;
    if std::env::var("REVIEW_APP").is_ok()
        && std::env::var("NODE_ENV").unwrap_or("".to_string()) == "production"
    {
        filename = ".env.review";
    } else if std::env::var("NODE_TEST").is_ok() {
        filename = ".env.test";
    } else if std::env::var("NODE_ENV").unwrap_or("".to_string()) != "production" {
        filename = ".env.development";
    } else {
        return;
    }
    let dotenv_path = dotenv::from_filename(filename).expect("failed to find .env file");
    println!("cargo:rerun-if-changed={}", dotenv_path.display());

    for env_var in dotenv::from_filename_iter(filename).unwrap() {
        let (key, value) = env_var.unwrap();
        println!("cargo:rustc-env={key}={value}");
    }
}
