#!/bin/bash
(which git >/dev/null && git submodule update --init --recursive)

yarn cache clean
. ./scripts/toolchain.sh && wasm-pack build lumium-renderer &&
cd lumium-renderer/pkg && yarn link && cd ../../ && yarn link lumium-renderer &&
../scripts/reduce-slug-size-heroku.sh
