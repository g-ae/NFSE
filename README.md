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
If you wish to start only one of the containers, you can do so by doing :
```sh
docker-compose up -d <name>
# Example :
docker-compose up -d backend
```

### Stop everything
To stop all containers
```sh
docker-compose down     # stops all containers
docker-compose down -v  # stops all containers and deletes all volumes
docker-compose down -v  --rmi all --remove-orphans  # deletes everything (container-wise)