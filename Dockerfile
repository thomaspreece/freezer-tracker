FROM node:16

WORKDIR /usr/src/app

COPY ./server/package*.json ./
COPY ./server .
COPY ./client/build ./public

RUN npm install

RUN mkdir -p ./public/database
RUN mkdir -p ./public/images
RUN mkdir -p ./public/images/thumbs

EXPOSE 3001

CMD [ "node", "./bin/www" ]
