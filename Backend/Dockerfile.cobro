FROM node:20-alpine
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium-browser
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx nest build cobro
RUN echo "=== Buscando main.js ===" && find . -path "*/dist/*main.js" -not -path "*/node_modules/*" -type f
EXPOSE 8080
CMD ["node", "apps/cobro/dist/main.js"]
