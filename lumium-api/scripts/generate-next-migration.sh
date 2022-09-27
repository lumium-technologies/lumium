#!/bin/bash
export DATABASE_URL=$(heroku pg:credentials:url DATABASE -a lumium-staging-api | tail -n1 | xargs)
PGSSLMODE=no-verify yarn run typeorm migration:generate ./src/migration/$1
