#!/bin/bash

if [[ "$OSTYPE" == "darwin"* ]]; then
    brew install llvm

    LLVM_PATH=/opt/homebrew/opt/llvm/

    RUSTC_WRAPPER="" \
    CC_wasm32_unknown_unknown=${LLVM_PATH:?}/bin/clang \
    CXX_wasm32_unknown_unknown=${LLVM_PATH:?}/bin/clang++ \
    AS_wasm32_unknown_unknown=${LLVM_PATH:?}/bin/llvm-as \
    AR_wasm32_unknown_unknown=${LLVM_PATH:?}/bin/llvm-ar \
    STRIP_wasm32_unknown_unknown=${LLVM_PATH:?}/bin/llvm-strip \
    wasm-pack test --chrome --headless
else
    wasm-pack test --chrome --headless
fi
