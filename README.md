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
```sh
docker-compose up -d
```
This will create all necessary containers and will run them all in the background in the correct order. 

### You're set
Your site is available at `localhost:3000`.

## Development
### Start only one container
If you wish to start only one of the containers in prod, you can do so by doing :
```sh
docker-compose up -d <name>
# Example :
docker-compose up -d backend
```

### Make commands
```sh
make start          # starts everything in prod
make stop           # stops all containers
make delete-hard    # deletes everything
make reset-hard     # deletes everything and restarts in prod

make dev            # starts all in development (all ports are open)
make dev-db         # starts postgres in dev (port 5432 is open)
make dev-backend    # starts postgres and backend in dev (ports are open)
```