FROM node:16-alpine

WORKDIR /src/

COPY package.json package-lock.json ./


RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm","start"]
