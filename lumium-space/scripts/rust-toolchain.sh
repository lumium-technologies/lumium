#!/bin/bash
CLANG_VERSION="14.0.6"
CLANG_URL="http://llvm.org/releases/$CLANG_VERSION/clang+llvm-$CLANG_VERSION-x86_64-linux-gnu-ubuntu-16.04.tar.xz"

if which cargo >/dev/null && which wasm-pack >/dev/null; then
    echo "rust toolchain already installed"
else
    echo "installing rust toolchain"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    . "$HOME/.cargo/env"
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | bash
    . "$HOME/.cargo/env"
    export PATH="$PATH:$HOME/.cargo/bin"
fi
if which clang >/dev/null; then
    echo "clang already installed"
else
    echo "installing clang"
    (
    mkdir $HOME/.clang
    cd $HOME/.clang/
    wget --quiet $CLANG_URL
    mkdir -p libs/clang
    tar -C libs/clang -xvf clang+llvm-$CLANG_VERSION-x86_64-linux-gnu-ubuntu-16.04.tar.xz
    mv libs/clang/clang+llvm-$CLANG_VERSION-x86_64-linux-gnu-ubuntu-16.04/* libs/clang
    rmdir libs/clang/clang+llvm-$CLANG_VERSION-x86_64-linux-gnu-ubuntu-16.04
    rm -f clang+llvm-$CLANG_VERSION-x86_64-linux-gnu-ubuntu-16.04.tar.xz
)
export PATH="$PATH:$HOME/.clang/libs/clang/bin"
fi
