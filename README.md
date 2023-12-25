# BLG317E-Project

## Setup

To setup the project first create the docker images using makefile. There are 2 necessary docker images need to be running for the application to work: mysql and frontend. To build and start these images follow instructions below:

```
make mysql
make frontend-build
```

In order for the database to work it needs to have the tables inside it. In order to create the database run the following command
```
make createdb
docker exec -it fifa-mysql mysql -u root --password=root
```

After these instructions you will be in the mysql interface. Then we need to copy all the data inside data.sql. So select fifa database and paste the data.sql inside mysql. After these operations the mysql server should be ready.

Then to start the servers and see the page run the following make instruction:

```
make start-servers
```
