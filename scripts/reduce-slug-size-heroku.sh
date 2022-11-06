#!/bin/bash
echo "cleaning up..."
rm -rf lumium-renderer/target
rm -rf clang+llvm-14.0.0-x86_64-linux-gnu-ubuntu-18.04
du -sh *
echo "finished cleaning up"
