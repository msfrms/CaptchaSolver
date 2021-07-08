FROM node:14.16.0
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "babel-node", "app.js" ]
