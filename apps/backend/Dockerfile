FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps/backend/package.json ./apps/backend/package.json
RUN yarn install

FROM deps AS build
COPY apps/backend ./apps/backend
RUN yarn workspace @presenterkit/backend build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY apps/backend/package.json ./apps/backend/package.json
RUN yarn workspaces focus @presenterkit/backend --production

COPY --from=build /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
