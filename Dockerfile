FROM node:18 as build-stage
ARG PORT
WORKDIR /usr/src/app

COPY package*.json ./
COPY public ./public/
COPY src ./src/
COPY *.mjs ./
COPY *.ts ./

RUN yarn install
RUN yarn build

FROM nginx:1.23.3-alpine

COPY --from=build-stage /usr/src/app/dist/ /var/www/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
