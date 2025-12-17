FROM node:25-alpine as build

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build en prod
COPY . .

EXPOSE 5173

# Au démarrage, on lance notre serveur Node
CMD ["npm", "run", "start"]