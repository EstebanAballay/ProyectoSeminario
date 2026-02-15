FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

#Comando necesario en linux,borrar si estas en windows
RUN chmod +x node_modules/.bin/nest

EXPOSE 3005

CMD ["npm", "run", "start:dev"]
