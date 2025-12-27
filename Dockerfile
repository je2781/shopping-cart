
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

# Install system dependencies for PHP extensions
RUN apt-get update && apt-get install -y \
    unzip git curl libzip-dev \
    && docker-php-ext-install zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy source code first (needed for post-install scripts)
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# =========================
# Stage 3: Runtime PHP-FPM
# =========================
FROM php:8.4-fpm

WORKDIR /var/www

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip curl procps \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libzip-dev \
    default-mysql-client netcat-openbsd \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip bcmath gd \
    && rm -rf /var/lib/apt/lists/*


# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy Laravel app from build-laravel stage
COPY --from=build-laravel /app .

# Copy built assets from build-assets stage
COPY --from=build-assets /app/public/build ./public/build

# Install PHP dependencies (runtime)
RUN composer install --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache public/build \
    && chmod -R 775 storage bootstrap/cache public/build

# Copy custom Nginx config from project root
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure Nginx logs folder exists
RUN mkdir -p /var/log/nginx

# Expose ports: 80 for HTTP, 9000 for PHP-FPM (optional)
EXPOSE 80 9000

# Start script to launch PHP-FPM + Nginx after waiting for MySQL
CMD ["sh", "-c", "/usr/local/bin/wait-for-mysql.sh"]
