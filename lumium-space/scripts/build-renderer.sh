#!/bin/bash
(which git >/dev/null && git submodule update --init --recursive)
        docker run --volume $(pwd)/../:/app ubuntu /app/lumium-space/scripts/docker-entry.sh
    cd lumium-renderer/pkg && yarn link && cd ../../ && yarn link lumium-renderer
