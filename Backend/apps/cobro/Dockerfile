<<<<<<< HEAD
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Eliminamos el RUN npm run build para evitar el error de compilación estática
CMD ["npm", "run", "start:dev", "cobro"]
=======
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g @nestjs/cli

RUN npm run build

CMD ["node", "dist/main.js"]

>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
