#!/bin/bash
if which cargo >/dev/null; then
    echo "rust toolchain already installed"
else
    echo "installing rust toolchain"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    . "$HOME/.cargo/env"
    export PATH="$PATH:$HOME/.cargo/bin"
fi

if which wasm-pack >/dev/null; then
    echo "wasm toolchain already installed"
else
    echo "installing wasm toolchain"
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | bash
    . "$HOME/.cargo/env"
fi

if which clang >/dev/null; then 
    echo "clang toolchain already installed"
else
    echo "installing clang toolchain"
    if [ ! -d "clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04" ]; then 
        rm -rf clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04
        curl https://github.com/llvm/llvm-project/releases/download/llvmorg-14.0.0/clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04.tar.xz -L --output clang.tar.xz
        tar -xvf clang.tar.xz
        rm -rf clang.tar.xz
    fi
    export PATH="$PATH:$PWD/clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04/bin"
fi
