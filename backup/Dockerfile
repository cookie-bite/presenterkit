# Stage 1: React Build Stage
FROM node:20-alpine AS react-build

WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm install --production
COPY client/ ./
RUN npm run build && rm -rf /usr/src/app/client/node_modules

# Stage 2: Node.js Build Stage
FROM node:20-alpine AS node-build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY --from=react-build /usr/src/app/client/build /usr/src/app/build
COPY . .

# Stage 3: Production Stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app
COPY --from=node-build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=node-build /usr/src/app/build /usr/src/app/build
COPY --from=node-build /usr/src/app ./
RUN rm -rf /usr/src/app/client

EXPOSE 50000

CMD ["npm", "start"]
