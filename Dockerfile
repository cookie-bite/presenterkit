FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm run build

EXPOSE 50000

CMD ["npm", "start"]