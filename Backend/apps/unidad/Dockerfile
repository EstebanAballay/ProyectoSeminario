FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g typescript @nestjs/cli
RUN tsc -p tsconfig.build.json

CMD ["node", "dist/main.js"]
