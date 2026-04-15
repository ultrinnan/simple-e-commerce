FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
# Add --no-scripts to prevent the 'artisan' error
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader --no-scripts

FROM php:8.3-cli-alpine
WORKDIR /var/www/html

RUN apk add --no-cache bash sqlite libzip-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_sqlite

COPY --from=vendor /app/vendor ./vendor
COPY . .

# Now that 'artisan' is present, we can run the discovery and optimize
# (Adding a composer dump-autoload here finishes what we skipped in stage 1)
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

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