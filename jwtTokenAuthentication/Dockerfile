FROM node:18.16.0
WORKDIR /nodeapi
COPY ./package*.json ./

RUN npm install
RUN npm install bcrypt@^5.1.0
COPY . .

EXPOSE 5000

CMD ["npm","run","server"]
