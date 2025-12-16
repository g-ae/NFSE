FROM node:25-alpine as build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build en prod
COPY . .
RUN npm start

# On expose le port 3000 (celui défini dans server.js)
EXPOSE 5173

# Au démarrage, on lance notre serveur Node proxy
CMD ["npm", "run", "dev"]