#!/bin/bash

curl -iL -X 'POST' \
  'http://localhost:5000/v1/auth/signup' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "test@example.com",
  "password": "testpassword",
  "username": "testuser"
}'
