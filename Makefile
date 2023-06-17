SHELL := /bin/bash

all: clean build test dockerize

build: build-lumium-space build-lumium-api

build-lumium-renderer: build-lumium-api
	(which git >/dev/null && git submodule update --init --recursive) || true;
	source ./scripts/toolchain.sh && \
		cd lumium-renderer; \
		./scripts/build.sh

build-lumium-space: build-lumium-renderer
	(cd lumium-renderer/pkg && (yarn unlink || true) && yarn link)
	cd lumium-space; \
		yarn link lumium-renderer && \
		yarn --frozen-lockfile && \
		yarn build

build-lumium-api:
	(which git >/dev/null && git submodule update --init --recursive) || true;
	source ./scripts/toolchain.sh && \
		cd lumium-api; \
		export SQLX_OFFLINE="true"; \
		cargo install --path . --root build --profile release --force

reduce-slug-size:
	[ -z "${LUMIUM_HEROKU_BUILD}" ] || \
		(rm -rf lumium-renderer/target; \
		rm -rf lumium-api/target; \
		rm -rf clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04; \
		du -sh **/*)

clean: clean-lumium-renderer clean-lumium-space clean-lumium-api
	rm -rf node_modules

clean-lumium-renderer:
	cd lumium-renderer; \
		rm -rf pkg target

clean-lumium-space:
	cd lumium-space; \
		rm -rf .next \
		rm -rf node_modules

clean-lumium-api:
	cd lumium-api; \
		rm -rf target

test: test-lumium-renderer test-lumium-space test-lumium-api

test-lumium-renderer: build-lumium-renderer
	source ./scripts/toolchain.sh && \
		cd lumium-renderer; \
		./scripts/test.sh

test-lumium-space: build-lumium-space build-lumium-api
	cd lumium-space; \
		yarn run cypress:test

test-lumium-api: build-lumium-api
	source ./scripts/toolchain.sh && \
		cd lumium-api; \
		export SQLX_OFFLINE="true"; \
		cargo test;

dockerize: dockerize-lumium-api dockerize-lumium-space

dockerize-lumium-api:
	docker build -t lumium-api:latest . -f lumium-api/Dockerfile --platform linux/amd64

dockerize-lumium-space:
	docker build -t lumium-space:latest . -f lumium-space/Dockerfile --platform linux/amd64

.PHONY: build build-lumium-api build-lumium-renderer build-lumium-space test test-lumium-api test-lumium-renderer test-lumium-space clean test reduce-slug-size dockerize dockerize-lumium-api dockerize-lumium-space
