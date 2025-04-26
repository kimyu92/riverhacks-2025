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

# View logs
logs:
	docker compose logs -f

# View logs for a specific service
# Usage: make logs-service service=backend
logs-service:
	docker compose logs -f $(service)

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
	@echo "  make db            - Access PostgreSQL database CLI"
	@echo "  make db-exec file=path/to/file.sql   - Execute SQL file against database"
	@echo "  make db-dump file=backup.sql         - Dump database to a file"
	@echo "  make db-seed       - Seed the database with sample data"
	@echo "  make db-reset      - Reset database (remove volume and reseed)"
	@echo "  make backend-shell - Access backend container shell"
	@echo "  make logs          - View logs from all services"
	@echo "  make logs-service service=backend    - View logs from specific service"
	@echo "  make rebuild       - Rebuild containers without using cache"
	@echo "  make ps            - Show running containers"

.PHONY: start start-logs down stop restart db db-exec db-dump db-seed db-reset backend-shell logs logs-service rebuild ps help
