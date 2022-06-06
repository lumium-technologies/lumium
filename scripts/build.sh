#!/bin/bash
if [[ ! -z ${REVIEW_APP} ]]; then
    cp lumium-space/.env.review lumium-space/.env
    cp lumium-api/.env.review lumium-api/.env
    cp lumium-dashboard/.env.review lumium-dashboard/.env
fi
if [[ -z ${LUMIUM_COMPONENT} ]]; then
    npm run build --workspaces
else
    npm run build --workspace ${LUMIUM_COMPONENT}
fi
