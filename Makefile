.PHONY: start delete-hard reset-hard dev test

start:
	docker compose up -d --build

stop:
	docker compose down

delete-hard:
	docker compose down -v --rmi all --remove-orphans

reset-hard:
	docker compose down -v --rmi all --remove-orphans
	docker compose up -d

dev:
	docker compose -f docker-compose.yml -f dev-compose.yml up -d
	
dev-db:
	docker compose -f docker-compose.yml -f dev-compose.yml up -d postgres
	
dev-backend:
	docker compose -f docker-compose.yml -f dev-compose.yml up -d backend

test:
	cd backend && npm test
	cd frontend && npm test -- run
	@echo "✅ Tests OK."