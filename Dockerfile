FROM node:12-alpine3.14
WORKDIR /ocr-elastic-api
COPY package.json /ocr-elastic-api
RUN npm install
COPY . /ocr-elastic-api
CMD node index.js
EXPOSE 8081