#!/bin/bash
./scripts/remove-cloudflare-dns.sh
set -e
if [[ ${LUMIUM_COMPONENT} == "lumium-api" ]]; then
    curl -X POST "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"type\":\"CNAME\",\"name\":\"pr-${HEROKU_PR_NUMBER}.api.review.lumium.space\",\"content\":\"$1\",\"ttl\":60,\"proxied\":true}"

elif [[ ${LUMIUM_COMPONENT} == "lumium-space" ]]; then
    curl -X POST "https://api.cloudflare.com/client/v4/zones/32237bfe24f8077cafdfe053c67c103f/dns_records" \
        -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
        -H "Content-Type: application/json" \
        --data "{\"type\":\"CNAME\",\"name\":\"pr-${HEROKU_PR_NUMBER}.review.lumium.space\",\"content\":\"$1\",\"ttl\":60,\"proxied\":true}"
fi
