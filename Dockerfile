FROM node:8.4.0

RUN apt-get update && apt-get install -y vim 

# create dir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install nodemon -g \
    && npm install pm2 -g

# copy source code
COPY . ./

RUN npm install

EXPOSE 8080

#ENTRYPOINT node app/api.js