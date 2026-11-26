# syntax=docker/dockerfile:1
FROM oven/bun:1.3.14 AS build
WORKDIR /app
ADD https://github.com/oyi77/1ai-payment.git#8de3883bfadb6a034f212857109fef59bff1067b /app/
RUN bun install --frozen-lockfile
COPY brand.mjs /tmp/brand.mjs
RUN bun /tmp/brand.mjs
COPY landing.html src/landing/index.html
RUN bun run build

FROM oven/bun:1.3.14
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./
RUN mkdir -p /data
ENV NODE_ENV=production DATABASE_PATH=/data/payment.db REQUIRE_HTTPS=true
EXPOSE 3100
CMD ["bun","run","src/index.ts"]
