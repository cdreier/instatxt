FROM node:9-alpine

RUN mkdir /app
WORKDIR /app
ADD server /app
ADD startAll.sh /app
ADD realtimeTxt.js /app
ADD package.json /app
ADD package-lock.json /app
RUN npm install

EXPOSE 1337
EXPOSE 80

CMD [ "./startAll.sh" ]
