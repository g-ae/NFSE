FROM node:25-alpine as build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build en prod
COPY . .
RUN npm start

# On expose le port 3000 (celui défini dans server.js)
EXPOSE 3000

# Au démarrage, on lance notre serveur Node proxy
CMD ["node", "server.js"]