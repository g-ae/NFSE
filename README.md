# Neighbourhood Food-Surplus Exchange

## Setting everything up
### Database variables
First of all, you must create a .env file at the root of the project (same as this README file) following the same structure as in the example : `.env.example`.
### Start containers
You can setup all the containers with a simple command :
```sh
make
```
This will create all necessary containers and will run them all in the background in the correct order. 

### You're set
When all containers are built and created, your site will be available at `localhost:3000`.

Default users are available at first if you want to test out the app. Example :
```
Buyers :
    - dev@genlog.ch | password
    - alice@example.com | password
Sellers :
    - city@coop.ch | password
    - migrolino@migros.ch | password
```
These sellers have a few bundles ready for reservations.

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
make                # starts everything in prod
make stop           # stops all containers
make delete         # deletes everything
make reset          # deletes everything and restarts in prod

make dev            # starts all in development (all ports are open)
make dev-db         # starts postgres in dev (port 5432 is open)
make dev-backend    # starts postgres and backend in dev (ports are open)
```
## API Schema
First of all, to use the API correctly, you must use the right IP. After running it in either prod or dev, it should be located at `localhost:4000`.
You can check the API's documentation on `backend/docs/API_DOCUMENTATION.md`.

### API Testing
You can run tests inside the `backend` folder with :

```bash
npm run test
```