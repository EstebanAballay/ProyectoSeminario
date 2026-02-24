FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

#Comando necesario en linux,borrar si estas en windows
RUN chmod +x node_modules/.bin/nest

RUN npm install -g @nestjs/cli

RUN npm run build

CMD ["node", "dist/main.js"]
