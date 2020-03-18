FROM alpine

ARG BIN_ARG=main-master-alpine
ENV BIN=$BIN_ARG

RUN mkdir /app
ADD $BIN /app
WORKDIR /app

EXPOSE 8080

CMD [ "sh", "-c", "./${BIN}" ]
