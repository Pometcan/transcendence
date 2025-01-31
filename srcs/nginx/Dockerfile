FROM nginx:1.27.3-alpine-slim

RUN apk add --no-cache openssl bash gettext

COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    mkdir -p /etc/nginx/ssl

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80 443
