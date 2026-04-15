# Stage 1: Vendor build
# Stage 1: Vendor build
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader --no-scripts

# Stage 2: Final Runtime
FROM php:8.4-cli-alpine
WORKDIR /var/www/html

RUN apk add --no-cache bash sqlite-dev libzip-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Copy composer binary from official image for the autoload dump
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy vendor from stage 1 and source code
# Copy composer binary from official image for the autoload dump
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy vendor from stage 1 and source code
COPY --from=vendor /app/vendor ./vendor
COPY . .

# Run the autoload and discovery scripts now that 'artisan' exists
# Run the autoload and discovery scripts now that 'artisan' exists
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# Permissions and DB setup
# Permissions and DB setup
RUN chmod +x /var/www/html/docker/entrypoint.sh \
    && mkdir -p database \
    && touch database/database.sqlite \
    && chown -R www-data:www-data storage bootstrap/cache database

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV APP_URL=https://api.simpl-e-commerce.fedirko.pro
ENV APP_URL=https://api.simpl-e-commerce.fedirko.pro
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=/var/www/html/database/database.sqlite

EXPOSE 8000

ENTRYPOINT ["/var/www/html/docker/entrypoint.sh"]