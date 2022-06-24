#!/bin/bash
if [[ ! -z ${REVIEW_APP} ]]; then
    cp lumium-space/.env.review lumium-space/.env
    cp lumium-api/.env.review lumium-api/.env
fi
if [[ -z ${LUMIUM_COMPONENT} ]]; then
    yarn workspaces run build
else
    cd ${LUMIUM_COMPONENT} && yarn build
fi
