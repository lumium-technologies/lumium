#!/bin/bash
set -e
record_id=$(cat cloudflare-record.json | jq '.result.id' | tr -d '"')
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records/${record_id}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json"
