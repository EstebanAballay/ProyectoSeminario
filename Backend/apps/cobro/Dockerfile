FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

#Comando necesario en linux,borrar si estas en windows
RUN chmod +x node_modules/.bin/nest

# Eliminamos el RUN npm run build para evitar el error de compilación estática
CMD ["npm", "run", "start:dev", "cobro"]
