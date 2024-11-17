FROM node:20 AS build

WORKDIR /frontend

EXPOSE 5173

COPY package*.json ./
RUN npm install
COPY . ./
