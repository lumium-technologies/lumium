#!/bin/bash
set -e
if [[ ${LUMIUM_COMPONENT} == "lumium-api" ]]; then
    record_id=$(curl -X GET "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records?type=CNAME&name=pr-${HEROKU_PR_NUMBER}.api.review.lumium.space" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" | jq '.result[0].id' | tr -d '"')

elif [[ ${LUMIUM_COMPONENT} == "lumium-space" ]]; then
    record_id=$(curl -X GET "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records?type=CNAME&name=pr-${HEROKU_PR_NUMBER}.review.lumium.space" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" | jq '.result[0].id' | tr -d '"')
fi
if [[ ! -z $record_id ]]; then
    curl -X DELETE "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records/${record_id}" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json"
fi
