FROM node:17-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000

CMD ["rails", "db:create", "db:migrate"]

CMD ["npm", "start"]