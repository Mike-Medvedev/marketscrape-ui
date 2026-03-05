FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_URL
ARG VITE_ENV=production
ARG VITE_GOOGLE_MAPS_API_KEY

COPY package.json package-lock.json openapi.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
