# ToSafeToBee Project Makefile

# Start all services in detached mode
start:
	docker compose up -d

# Start all services with logs
start-logs:
	docker compose up

# Stop and remove containers
down:
	docker compose down

# Stop services without removing containers
stop:
	docker compose stop

# Restart all services
restart:
	docker compose restart

# Start only backend service
backend-start:
	docker compose up -d backend

# Start only frontend service
frontend-start:
	docker compose up -d frontend

# Start Nginx service
nginx-start:
	docker compose up -d nginx

# Start backend with logs
backend-start-logs:
	docker compose up backend

# Start frontend with logs
frontend-start-logs:
	docker compose up frontend

# Start Nginx with logs
nginx-start-logs:
	docker compose up nginx

# Access PostgreSQL database CLI
db:
	docker compose exec db bash -c "PGPASSWORD=hackpass psql -U hackuser hacksafety"

# Execute any SQL file against the database
# Usage: make db-exec file=path/to/file.sql
db-exec:
	docker compose exec db bash -c "PGPASSWORD=hackpass psql -U hackuser hacksafety -f $(file)"

# Dump database to a file
# Usage: make db-dump file=backup.sql
db-dump:
	docker compose exec db bash -c "PGPASSWORD=hackpass pg_dump -U hackuser hacksafety > $(file)"

# Seed the database with sample data
db-seed:
	docker compose exec backend python -m db.seed

# Reset the database completely (remove volume and reseed)
db-reset:
	docker compose down -v
	docker compose up -d db
	@echo "Waiting for database to initialize..."
	@sleep 5
	docker compose up -d backend
	@echo "Waiting for backend to start..."
	@sleep 3
	docker compose exec backend python -m db.seed
	@echo "Database reset and reseeded successfully!"

# Access backend container shell
backend-shell:
	docker compose exec backend bash

# Access frontend container shell
frontend-shell:
	docker compose exec frontend bash

# Access Nginx container shell
nginx-shell:
	docker compose exec nginx sh

# Remove backend image
backend-remove-image:
	docker compose rm -f backend
	docker rmi riverhacks-2025-backend

# Remove frontend image
frontend-remove-image:
	docker compose rm -f frontend
	docker rmi riverhacks-2025-frontend

# Remove Nginx image
nginx-remove-image:
	docker compose rm -f nginx
	docker rmi nginx:alpine

# Remove all images
remove-images:
	docker compose rm -f backend frontend nginx
	docker rmi riverhacks-2025-backend riverhacks-2025-frontend nginx:alpine 2>/dev/null || true

# Regenerate SSL certificates
ssl-regen:
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/nginx.key -out nginx/ssl/nginx.crt -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost"
	@echo "SSL certificates regenerated. Restart Nginx to apply changes: make nginx-restart"

# Restart Nginx to apply new configurations/certificates
nginx-restart:
	docker compose restart nginx

# Frontend commands
frontend-install:
	docker compose exec frontend pnpm install

frontend-dev:
	docker compose exec frontend pnpm run dev

# View logs
logs:
	docker compose logs -f

# View logs for a specific service
# Usage: make logs-service service=backend
logs-service:
	docker compose logs -f $(service)

# View logs with specific number of lines
# Usage: make logs-tail lines=100
logs-tail:
	docker compose logs -f --tail=$(lines)

# View logs for a specific service with number of lines
# Usage: make logs-service-tail service=backend lines=100
logs-service-tail:
	docker compose logs -f $(service) --tail=$(lines)

# View logs since a specific time
# Usage: make logs-since time="1h" (1h, 10m, 30s, 2023-01-30, etc.)
logs-since:
	docker compose logs -f --since=$(time)

# View logs for a specific service since a specific time
# Usage: make logs-service-since service=backend time="1h"
logs-service-since:
	docker compose logs -f $(service) --since=$(time)

# Rebuild containers
rebuild:
	docker compose build --no-cache

# Show running containers
ps:
	docker compose ps

# Help command
help:
	@echo "Available commands:"
	@echo "  make start         - Start all services in detached mode"
	@echo "  make start-logs    - Start all services with logs"
	@echo "  make down          - Stop and remove containers"
	@echo "  make stop          - Stop services without removing containers"
	@echo "  make restart       - Restart all services"
	@echo "  make backend-start - Start only backend service"
	@echo "  make frontend-start - Start only frontend service"
	@echo "  make nginx-start   - Start only Nginx service"
	@echo "  make backend-start-logs - Start backend with logs"
	@echo "  make frontend-start-logs - Start frontend with logs"
	@echo "  make nginx-start-logs - Start Nginx with logs"
	@echo "  make db            - Access PostgreSQL database CLI"
	@echo "  make db-exec file=path/to/file.sql   - Execute SQL file against database"
	@echo "  make db-dump file=backup.sql         - Dump database to a file"
	@echo "  make db-seed       - Seed the database with sample data"
	@echo "  make db-reset      - Reset database (remove volume and reseed)"
	@echo "  make backend-shell - Access backend container shell"
	@echo "  make frontend-shell - Access frontend container shell"
	@echo "  make nginx-shell   - Access Nginx container shell"
	@echo "  make backend-remove-image - Remove backend image"
	@echo "  make frontend-remove-image - Remove frontend image"
	@echo "  make nginx-remove-image - Remove Nginx image"
	@echo "  make remove-images - Remove all images"
	@echo "  make ssl-regen     - Regenerate SSL certificates"
	@echo "  make nginx-restart - Restart Nginx to apply new configurations"
	@echo "  make frontend-install - Install frontend dependencies"
	@echo "  make frontend-dev  - Run frontend development server"
	@echo "  make logs          - View logs from all services"
	@echo "  make logs-service service=backend    - View logs from specific service"
	@echo "  make logs-tail lines=100             - View logs with specific number of lines"
	@echo "  make logs-service-tail service=backend lines=100 - View service logs with line limit"
	@echo "  make logs-since time='1h'            - View logs since specific time (1h, 10m, etc.)"
	@echo "  make logs-service-since service=backend time='1h' - View service logs since specific time"
	@echo "  make rebuild       - Rebuild containers without using cache"
	@echo "  make ps            - Show running containers"

.PHONY: start start-logs down stop restart backend-start frontend-start nginx-start backend-start-logs frontend-start-logs nginx-start-logs db db-exec db-dump db-seed db-reset backend-shell frontend-shell nginx-shell backend-remove-image frontend-remove-image nginx-remove-image remove-images ssl-regen nginx-restart frontend-install frontend-dev logs logs-service logs-tail logs-service-tail logs-since logs-service-since rebuild ps help
