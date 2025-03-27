# docker pull ghcr.io/puppeteer/puppeteer:latest
FROM puppeteer

WORKDIR /app

COPY . .

RUN npm i

CMD [ "node", "--watch", "index.js" ]
