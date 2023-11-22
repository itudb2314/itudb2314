pwd := $(shell pwd)

#different at my own computer
mysql:
	docker run --name fifa-mysql -e MYSQL_ROOT_PASSWORD=root -d -p 3306:3306 mysql:8.1

mysql-start:
	docker start fifa-mysql

mysql-stop:
	docker stop fifa-mysql

mysql-remove:
	docker stop fifa-mysql && \
	docker rm fifa-mysql

createdb:
	docker exec -it fifa-mysql mysql -u root --password=root -e "CREATE DATABASE fifa;"

removedb:
	docker exec -it fifa-mysql mysql -u root --password=root -e "DROP DATABASE fifa;"

#different at my own computer
server:
	cd backend/ && \
	python3 main.py

frontend-build:
	cd ./frontend && \
	docker build -t fifa-frontend .
	docker run -d -p 3000:3000 -v /app/node_modules -v $(pwd)/frontend:/app --name fifa-frontend fifa-frontend:latest
	
frontend-start:
	docker start fifa-frontend

frontend-stop:
	docker stop fifa-frontend

remove-frontend-docker:
	docker stop fifa-frontend && \
	docker rm fifa-frontend

.PHONY: mysql mysql-start mysql-stop mysql-remove frontend-build frontend-start frontend-stop remove-frontend-docker
