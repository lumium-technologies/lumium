#!/bin/bash
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
    git clone --depth=1 https://github.com/llvm/llvm-project
    cd llvm-project
    mkdir build
    cd build
    cmake -DLLVM_ENABLE_PROJECTS=clang -DCMAKE_BUILD_TYPE=Release -G "Unix Makefiles" ../llvm
    make -j`nproc`
)
export PATH="$PATH:$HOME/.clang/llvm/build/bin"
fi
