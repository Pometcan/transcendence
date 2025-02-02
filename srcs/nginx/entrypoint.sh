#!/bin/sh

# Generate CA
openssl genrsa -out /etc/nginx/ssl/ca.key 2048
openssl req -new -x509 -days 3650 -key /etc/nginx/ssl/ca.key -out /etc/nginx/ssl/ca.crt \
    -subj "/C=TR/ST=Istanbul/O=Pomet Development CA/CN=Pomet Local Certificate Authority"

# Generate server certificate with SANs
openssl req -newkey rsa:2048 -nodes -keyout /etc/nginx/ssl/server.key \
    -out /etc/nginx/ssl/server.csr \
    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=Pomet Development/CN=*.pometcan" \
    -addext "subjectAltName=DNS:${FRONTEND_DOMAIN},DNS:${BACKEND_DOMAIN}"

openssl x509 -req -days 3650 \
    -in /etc/nginx/ssl/server.csr \
    -CA /etc/nginx/ssl/ca.crt \
    -CAkey /etc/nginx/ssl/ca.key \
    -CAcreateserial \
    -out /etc/nginx/ssl/server.crt

# Create certificate chain
cat /etc/nginx/ssl/server.crt /etc/nginx/ssl/ca.crt > /etc/nginx/ssl/fullchain.crt

# Generate nginx config
envsubst '${DOMAIN} ${NGINX_PORT} ${NGINX_PORT_SSL}' \
    < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'
