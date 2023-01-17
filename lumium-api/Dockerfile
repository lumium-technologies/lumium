FROM rust:latest AS builder
WORKDIR /usr/src/
RUN rustup target add x86_64-unknown-linux-musl

RUN USER=root cargo new lumium
WORKDIR /usr/src/lumium
COPY Cargo.toml Cargo.lock ./
RUN cargo build --release

COPY src ./src
COPY templates ./templates
RUN cargo install --target x86_64-unknown-linux-musl --path .

FROM scratch
COPY --from=builder /usr/local/cargo/bin/lumium .
USER 1000
CMD ["./lumium", "-a", "0.0.0.0", "-p", "8080"]
