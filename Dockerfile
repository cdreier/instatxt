FROM node:9-alpine

RUN mkdir /app
ADD . /app
RUN npm install

EXPOSE 1337
EXPOSE 80

