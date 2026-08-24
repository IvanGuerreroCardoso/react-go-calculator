FROM node:24-alpine AS builder
WORKDIR /src
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /src/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
