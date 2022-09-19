#!/bin/bash
if [[ -z ${LUMIUM_COMPONENT} ]]; then
    yarn workspaces run build
else
    cd ${LUMIUM_COMPONENT} && yarn build
fi
