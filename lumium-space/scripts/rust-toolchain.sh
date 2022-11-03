#!/bin/bash
if which cargo >/dev/null && which wasm-pack >/dev/null && which clang >/dev/null; then
    echo "rust toolchain already installed"
else
    echo "installing rust toolchain"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    . "$HOME/.cargo/env"
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | bash
    . "$HOME/.cargo/env"
    export PATH="$PATH:$HOME/.cargo/bin"
fi
