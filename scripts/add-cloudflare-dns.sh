#!/bin/bash
set -e
if [[ -f cloudflare-record.json ]]; then
    ./scripts/remove-cloudflare-dns.sh
fi
if [[ ${LUMIUM_COMPONENT} == "lumium-api" ]]; then
    curl -X POST "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"type\":\"CNAME\",\"name\":\"api.pr-${HEROKU_PR_NUMBER}.review.lumium.space\",\"content\":\"lumium-api-pr-${HEROKU_PR_NUMBER}.herokuapp.com\",\"ttl\":60,\"proxied\":true}" \
        -o cloudflare-record.json

elif [[ ${LUMIUM_COMPONENT} == "lumium-space" ]]; then
    curl -X POST "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"type\":\"CNAME\",\"name\":\"pr-${HEROKU_PR_NUMBER}.review.lumium.space\",\"content\":\"lumium-space-pr-${HEROKU_PR_NUMBER}.herokuapp.com\",\"ttl\":60,\"proxied\":true}" \
        -o cloudflare-record.json
fi
