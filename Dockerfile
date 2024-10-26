FROM node:22.10.0-bullseye-slim AS base

RUN corepack enable
RUN corepack prepare pnpm@9.7.1 --activate


FROM base AS deps

WORKDIR /app

ADD package.json pnpm-lock.yaml ./
RUN pnpm install

# Setup production node_modules
FROM base AS production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json pnpm-lock.yaml ./
RUN pnpm prune --prod

# Build the app
FROM base AS build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN pnpm build

# Finally, build the production image with minimal footprint
FROM base

ENV PORT="8080"
ENV NODE_ENV="production"

WORKDIR /app

COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/pnpm-lock.yaml /app/pnpm-lock.yaml

EXPOSE $PORT

CMD [ "pnpm", "start" ]
