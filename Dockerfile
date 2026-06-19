FROM node:24-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

FROM nginx:1.25.4-alpine-slim as prod

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
