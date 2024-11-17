COMPOSE=docker compose
DOCKER=docker
ENV_FILE=.env

.PHONY: help build up down stop restart remove clean logs shell dbshell migrate createsuperuser reload

all: up

help:
	@echo "Kullanılabilir komutlar:"
	@echo "  make build               - Servisleri build eder."
	@echo "  make up                  - Servisleri ayağa kaldırır."
	@echo "  make down                - Servisleri durdurur ve siler."
	@echo "  make stop                - Servisleri sadece durdurur, silmez."
	@echo "  make restart             - Servisleri yeniden başlatır."
	@echo "  make remove              - Tüm servisleri ve containerları siler."
	@echo "  make clean               - Tüm container, network, volume'ları siler."
	@echo "  make logs                - Tüm servislerin loglarını görüntüler."
	@echo "  make shell               - Django konteynerine terminal ile girer."
	@echo "  make dbshell             - PostgreSQL veritabanına bağlanır."
	@echo "  make migrate             - Django veritabanı migrate işlemi yapar."
	@echo "  make createsuperuser     - Django admin kullanıcısı oluşturur."
	@echo "  make reload              - Tüm servisleri yeniden yükler."

build:
	@$(COMPOSE) build --no-cache

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

shell:
	@$(COMPOSE) exec backend /bin/bash

dbshell:
	@$(COMPOSE) exec postgres_db psql -U $$POSTGRES_USER -d $$POSTGRES_DB

migrate:
	@$(COMPOSE) exec django python manage.py migrate

createsuperuser:
	@$(COMPOSE) exec django python manage.py createsuperuser

remove_images:
	@docker rmi -f $$(docker images -a -q) || echo "No images to remove"

reload: down up
	@echo "Server is restarting...."
