#!/bin/bash
(which git >/dev/null && git submodule update --init --recursive)

. ./scripts/rust-toolchain.sh && wasm-pack build lumium-renderer &&
cd lumium-renderer/pkg && yarn link && cd ../../ && yarn link lumium-renderer
