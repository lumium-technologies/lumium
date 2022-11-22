#!/bin/bash
apt-get update && apt-get install -y curl clang && cd /app/lumium-space/ && . ./scripts/rust-toolchain.sh && wasm-pack build --target web lumium-renderer
