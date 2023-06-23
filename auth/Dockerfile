FROM node:alpine

WORKDIR /app
COPY package*.json .
RUN npm install --omit=dev
RUN npm install ts-node-dev -g
COPY . .
CMD ["npm", "run", "dev"]