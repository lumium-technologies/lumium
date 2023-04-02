#!/bin/bash

curl -iL -X 'POST' \
  'http://localhost:5000/v1/auth/signin' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "password": "testpassword",
  "email": "test@example.com"
}'
