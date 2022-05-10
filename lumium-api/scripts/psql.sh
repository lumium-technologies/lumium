#!/bin/bash
psql -Atx $(heroku config -a booking-staging-api | grep DATABASE_URL | awk '{ print $2 }')
