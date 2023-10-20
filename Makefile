pwd := $(shell pwd)

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

.PHONY: frontend-build frontend-start frontend-stop remove-frontend-docker
