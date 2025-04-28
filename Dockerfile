# Dockerfile

# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/ .
RUN npm install && npm run build

# Severt stage
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80