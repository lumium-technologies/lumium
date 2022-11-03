(which git >/dev/null && git submodule update --init --recursive)
    clang_present=$(which clang)
    if [ -x "$clang_present" ]; then
        docker run --volume $(pwd)/../:/app debian /app/lumium-space/scripts/docker-entry.sh
    else
        . ./scripts/rust-toolchain.sh && wasm-pack build --target web lumium-renderer
    fi
    cd lumium-renderer/pkg && yarn link && cd ../../ && yarn link lumium-renderer
