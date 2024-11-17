FROM node:20 AS build

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 5173
