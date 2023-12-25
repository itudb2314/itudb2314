# BLG317E-Project

## Setup

To setup the project first create the docker images using makefile. There are 2 necessary docker images need to be running for the application to work: mysql and frontend. To build and start these images follow instructions below:

```
make mysql
make frontend-build
```

Then to start the servers and see the page run the following make instruction:

```
make start-servers
```
