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
```
GET "/sellers"                  -> returns all sellers from the db
GET "/sellers/:id"              -> returns data from a specific seller

GET "/bundles"                  -> return all available bundles from the db
GET "/bundles/:id"              -> return data from specific bundle
GET "/bundles/reserved"         -> return all reserved bundles for the user (buyer)
GET "/bundles/confirmed"        -> return all confirmed bundles for the user (buyer)
POST "/bundles/new"             -> create new bundle with data from JSON body (needs "authorization: bearer token" header)
PATCH "/bundles/reserve"        -> reserve a bundle as a buyer, needs Authorization header + JSON body with "bundleId".
PATCH "/bundles/unreserve"      -> unreserve a bundle as a buyer, needs Authorization header + JSON body with "bundleId".
PATCH "/bundles/confirm"        -> confirm a bundle as a buyer, needs Authorization header + JSON body with "bundleId".
PATCH "/bundles/confirmPickup"  -> confirm that a bundle has been picked up by the buyer, needs Authorization header + JSON body with "bundleId".

POST "/account/buyer"           -> login for buyer account (email / password in JSON body as "email" and "password"). password must be SHA-256 encrypted. This will return a token that can be used to rate sellers, buy bundles, etc.
POST "/account/buyer/register"  -> register a buyer account, all data in JSON body

POST "/account/seller"          -> login for seller account (email / password in json like buyer login) -> returns a token
POST "/account/seller/register" -> register a seller account, all data in JSON body, needed data: ["email", "password", "name", "telephone", "country", "state", "npa", "street", "street_no"]
```