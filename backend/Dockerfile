FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader

FROM php:8.3-cli-alpine
WORKDIR /var/www/html

RUN apk add --no-cache bash sqlite libzip-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_sqlite

COPY --from=vendor /app/vendor ./vendor
COPY . .

RUN chmod +x /var/www/html/docker/entrypoint.sh \
    && mkdir -p database \
    && touch database/database.sqlite \
    && chown -R www-data:www-data storage bootstrap/cache database

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_URL=http://localhost:8000
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=/var/www/html/database/database.sqlite

EXPOSE 8000

ENTRYPOINT ["/var/www/html/docker/entrypoint.sh"]
