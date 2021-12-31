FROM node:16

WORKDIR /usr/src/app

COPY ./server/package*.json ./
COPY ./server .
COPY ./client/build ./public

RUN mkdir -p ./server/public/images
RUN mkdir -p ./server/public/images/thumbs

RUN npm install

EXPOSE 3001

CMD [ "node", "./bin/www" ]
