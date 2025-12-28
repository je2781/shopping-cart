
# =========================
# Stage 1: Build frontend assets
# =========================
FROM php:8.4-cli AS build-assets

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install system dependencies for PHP extensions (if needed for wayfinder)
RUN apt-get update && apt-get install -y \
    unzip git curl libzip-dev \
    && docker-php-ext-install zip

# Install Composer (needed for wayfinder if it uses composer)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy source code first (needed for wayfinder artisan command)
COPY . .

# Install PHP deps (wayfinder might need vendor)
RUN composer install --no-dev --optimize-autoloader

# Install Node dependencies
RUN npm install

# Build assets (this creates public/build with manifest.json)
RUN npm run build

# =========================
# Stage 2: Build Laravel app
# =========================
FROM php:8.4-cli AS build-laravel

RUN apt-get update && apt-get install -y \
    unzip git curl libzip-dev \
    && docker-php-ext-install zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy FULL Laravel app first
COPY . .

# Now composer can safely run artisan
RUN composer install --no-dev --optimize-autoloader --prefer-dist


# =========================
# Stage 3: Runtime PHP-FPM
# =========================
FROM php:8.4-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libzip-dev \
    default-mysql-client netcat-openbsd \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip bcmath gd \
    && rm -rf /var/lib/apt/lists/*

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel app
COPY --from=build-laravel /app /var/www

# Copy built assets into the correct public path
COPY --from=build-assets /app/public/build /var/www/public/build

# Install PHP dependencies (runtime)
RUN composer install --optimize-autoloader --prefer-dist

RUN chown -R www-data:www-data storage bootstrap/cache public/build \
    && chmod -R 775 storage bootstrap/cache public/build


COPY nginx.conf /etc/nginx/sites-available/default

COPY wait-for-mysql.sh /usr/local/bin/wait-for-mysql.sh
RUN chmod +x /usr/local/bin/wait-for-mysql.sh

EXPOSE 80
CMD ["sh", "/usr/local/bin/wait-for-mysql.sh"]

