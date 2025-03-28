FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY . .

RUN npm i

EXPOSE 3000

CMD [ "node", "--watch", "index.js" ]
