#VMA Frontend Dockerfile

FROM nginx:alpine

COPY ./Frontend/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

COPY ./Frontend/dist/frontend/ .