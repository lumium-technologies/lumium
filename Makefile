SHELL := /bin/bash

build: build-lumium-space build-lumium-api reduce-slug-size

build-lumium-renderer:
	(which git >/dev/null && git submodule update --init --recursive) || true;
	source ./scripts/toolchain.sh && \
		cd lumium-renderer; \
		wasm-pack build --release

build-lumium-space: build-lumium-renderer
	(cd lumium-renderer/pkg && (yarn unlink || true) && yarn link)
	cd lumium-space; \
		yarn link lumium-renderer; \
		yarn --frozen-lockfile; \
		yarn build

build-lumium-api:
	source ./scripts/toolchain.sh && \
		cd lumium-api; \
		cargo build --release \
		cargo install --path .

reduce-slug-size:
	[ -z "${LUMIUM_HEROKU_BUILD}" ] || \
		(rm -rf lumium-renderer/target;
	rm -rf lumium-space/clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04)

clean: clean-lumium-renderer clean-lumium-space clean-lumium-api

clean-lumium-renderer:
	cd lumium-renderer; \
		rm -rf pkg target

clean-lumium-space:
	cd lumium-space; \
		rm -rf .next

clean-lumium-api:
	cd lumium-api; \
		rm -rf target

test: test-lumium-renderer test-lumium-space test-lumium-api

test-lumium-renderer:
	source ./scripts/toolchain.sh && \
		cd lumium-renderer; \
		wasm-pack test --chrome --headless

test-lumium-space: build-lumium-space build-lumium-api
	cd lumium-space; \
		yarn run cypress:test

test-lumium-api:
	source ./scripts/toolchain.sh && \
		cd lumium-api; \
		cargo test

.PHONY: clean test reduce-slug-size
