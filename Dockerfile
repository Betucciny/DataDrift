FROM node:22-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
COPY ./prisma /app/prisma
WORKDIR /app
RUN npm ci
RUN mkdir -p /app/db
RUN npx prisma generate
RUN npx prisma migrate deploy

FROM node:22-alpine AS build-env
COPY . /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM node:22-alpine
COPY ./package.json package-lock.json /app/
COPY ./public /app/public
COPY ./server /app/server
COPY ./server.js /app/server.js
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=production-dependencies-env /app/db /app/db
COPY --from=production-dependencies-env /app/prisma /app/prisma
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
