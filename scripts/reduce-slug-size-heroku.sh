#!/bin/bash
[ -z "${LUMIUM_HEROKU_BUILD}" ] && exit 0;
echo "cleaning up..."
du -sh *
du -sh */**
rm -rf lumium-renderer/target
rm -rf lumium-space/clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04
du -sh *
du -sh */**
echo "finished cleaning up"