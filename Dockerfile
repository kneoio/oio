FROM node:20-alpine AS builder
ARG VITE_STREAM_BASE_URL
ENV VITE_STREAM_BASE_URL=$VITE_STREAM_BASE_URL
WORKDIR /app
COPY vue-station-app/package*.json ./
RUN npm ci
COPY vue-station-app/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server.cjs ./
RUN npm install express
EXPOSE 8092
CMD ["node", "server.cjs"]
