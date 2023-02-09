FROM node:18.8

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . . 

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start" ]