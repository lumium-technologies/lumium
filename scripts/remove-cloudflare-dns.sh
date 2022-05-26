#!/bin/bash
set -e
record_id = $(cat cloudflare-record.json | grep "\"id\":" | awk '{print $2}' | tr -d '"' | tr -d ',')
curl -X DELETE "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records/${record_id}" \
    -H "X-Auth-Email: ${CLOUDFLARE_API_EMAIL}" \
    -H "X-Auth-Key: ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json"
