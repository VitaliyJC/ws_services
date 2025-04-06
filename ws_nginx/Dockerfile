FROM nginx:alpine

# Удаляем стандартные конфиги, особенно IPv6 auto-tune
RUN rm -rf /etc/nginx/conf.d/* /docker-entrypoint.d/*

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/nginx.conf
