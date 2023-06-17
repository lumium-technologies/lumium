FROM rust:latest AS builder
WORKDIR /usr/src/
RUN rustup target add x86_64-unknown-linux-gnu

RUN USER=root mkdir /usr/src/lumium
COPY . /usr/src/lumium/
WORKDIR /usr/src/lumium/lumium-api
RUN cargo install --target x86_64-unknown-linux-gnu --path .

FROM scratch
COPY --from=builder /usr/src/lumium/lumium-api/build/bin/* .
USER 1000
CMD [ "./lumium-api" ]
