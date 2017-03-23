FROM node

COPY package.json .
RUN npm install
COPY . .

CMD PORT=$PORT node server.js