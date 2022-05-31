#!/bin/bash
if [ -z $LUMIUM_COLLABORATOR ]; then
    echo "Pulling environment from staging..."
    export SUPERTOKENS_API_KEY=$(heroku config -a lumium-staging-api | grep SUPERTOKENS_API_KEY | awk '{ print $2 }')
    export SUPERTOKENS_CONNECTION_URI=$(heroku config -a lumium-staging-api | grep SUPERTOKENS_CONNECTION_URI | awk '{ print $2 }')
    export DATABASE_URL="postgres://development:development@localhost:5432/lumium"
fi
