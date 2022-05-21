# Install dependencies only when needed
FROM node:lts-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# Optional - If you are not using node-gyp, un-comment this line. Check https://stackoverflow.com/questions/44371864/using-docker-with-nodejs-with-node-gyp-dependencies
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:lts-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY ./src ./src
RUN npm run build --if-present
RUN echo $(ls ./dist)

# Production image, copy all the files and run nginx
FROM node:lts-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
COPY ./.env.prod ./

ENV PORT 80
EXPOSE 80
CMD ["node", "dist/main"]
