FROM node:20

WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install

COPY . .
RUN npm install -g @nestjs/cli
RUN npm run build

CMD ["node", "dist/main.js"]
