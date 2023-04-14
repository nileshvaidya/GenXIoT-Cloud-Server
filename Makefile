ifneq (,$(wildcard ./.env))
	include .env
	export
	ENV_FILE_PARAM = --env-file .env
endif

build:
	docker-compose up --build --remove-orphans

up:
	docker-compose up

down:
	docker-compose down -v

volume:
	docker volume inspect genxiottemp_mongodb-data
