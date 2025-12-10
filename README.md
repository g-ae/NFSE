# Neighbourhood Food-Surplus Exchange

## Setting everything up
### Database variables
First of all, you must create a .env file at the root of the project (same as this README file) with the following variables (you can change their content as you like), this example is available in the `.env.example` file :
```
POSTGRES_DB=nfse
POSTGRES_USER=nfseadmin
POSTGRES_PASSWORD=my-password
```
### Start containers
You can setup all the containers with a simple command :
```
docker-compose up -d
```
This will create all necessary containers and will run them all in the background in the correct order. 