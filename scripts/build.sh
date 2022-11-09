#!/bin/bash
yarn cache clean
export ENABLE_REDUCE_SLUG_SIZE_HEROKU=true; 
if [[ -z ${LUMIUM_COMPONENT} ]]; then
    yarn workspaces run build
else
    cd ${LUMIUM_COMPONENT} && yarn build
fi
