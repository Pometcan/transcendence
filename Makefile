COMPOSE=docker compose
DOCKER=docker
ENV_FILE=.env

.PHONY: help build up down stop restart remove clean logs shell dbshell migrate createsuperuser reload re \
        build_nginx build_backend build_frontend shell_nginx shell_backend shell_frontend

all: up

help:
	@echo "Kullanılabilir komutlar:"
	@echo "  make build               - Servisleri build eder."
	@echo "  make build_nginx         - Sadece nginx servisini build eder."
	@echo "  make build_backend       - Sadece backend servisini build eder."
	@echo "  make up                  - Servisleri ayağa kaldırır."
	@echo "  make down                - Servisleri durdurur ve siler."
	@echo "  make stop                - Servisleri sadece durdurur, silmez."
	@echo "  make restart             - Servisleri yeniden başlatır."
	@echo "  make remove              - Tüm servisleri ve containerları siler."
	@echo "  make clean               - Tüm container, network, volume'ları siler."
	@echo "  make logs                - Tüm servislerin loglarını görüntüler."
	@echo "  make shell_nginx         - Nginx konteynerine terminal ile girer."
	@echo "  make shell_backend       - Backend konteynerine terminal ile girer."
	@echo "  make dbshell             - PostgreSQL veritabanına bağlanır."
	@echo "  make migrate             - Django veritabanı migrate işlemi yapar."
	@echo "  make createsuperuser     - Django admin kullanıcısı oluşturur."
	@echo "  make reload              - Tüm servisleri yeniden yükler."
	@echo "  make re                  - reload komutunun kısa hali."

build:
	@$(COMPOSE) build --no-cache

build_nginx:
	@$(COMPOSE) build nginx  --no-cache

build_backend:
	@$(COMPOSE) build backend  --no-cache

up:
	@$(COMPOSE) --env-file $(ENV_FILE) up -d

down:
	@$(COMPOSE) down

stop:
	@$(COMPOSE) stop

restart:
	@$(COMPOSE) restart

remove:
	@$(COMPOSE) down --volumes --remove-orphans

clean: remove
	@$(DOCKER) volume prune -f
	@$(DOCKER) network prune -f
	@$(DOCKER) container prune -f
	@$(DOCKER) image prune -f

logs:
	@$(COMPOSE) logs -f

shell_nginx:
	@$(COMPOSE) exec nginx /bin/sh

shell_backend:
	@$(COMPOSE) exec backend /bin/bash

dbshell:
	@$(COMPOSE) exec postgresql psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

migrate:
	@$(COMPOSE) exec backend python manage.py migrate

createsuperuser:
	@$(COMPOSE) exec backend python manage.py createsuperuser

remove_images:
	@docker rmi -f $$(docker images -a -q) || echo "No images to remove"

reload: down up
	@echo "Server is restarting...."

re: reload
