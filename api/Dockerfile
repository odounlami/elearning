FROM node:24-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json prisma7.config.ts ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate && npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma7.config.ts ./prisma7.config.ts
COPY --from=build /app/src ./src
COPY --from=build /app/generated ./generated
COPY --from=build /app/dist ./dist
CMD ["npm", "start"]
