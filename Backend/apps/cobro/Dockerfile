FROM node:20-alpine
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
# Evitamos que baje la versión incompatible
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Eliminamos el RUN npm run build para evitar el error de compilación estática
CMD ["npm", "run", "start:dev", "cobro"]