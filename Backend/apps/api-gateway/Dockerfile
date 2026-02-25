FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero los package para aprovechar el caché de Docker
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto del Gateway (asumamos el 3000)
EXPOSE 3000

# Comando para iniciar en modo desarrollo (o start:prod si prefieres)
CMD ["npm", "run", "start:dev"]