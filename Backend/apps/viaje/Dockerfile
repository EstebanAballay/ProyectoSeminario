FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm install -g @nestjs/cli

RUN npm run build

CMD ["node", "dist/apps/viaje/src/main.js"]