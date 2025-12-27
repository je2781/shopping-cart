#!/bin/sh
# wait-for-pgsql.sh

set -e

host="admin_db"
port="3306"

until nc -z "$host" "$port"; do
  echo "Waiting for mysql at $host:$port..."
  sleep 2
done

# Fix Laravel permissions every time container starts
RUN chown -R www-data:www-data storage bootstrap/cache public/build \
    && chmod -R 775 storage bootstrap/cache public/build

echo "Running migrations..."
composer migrate

echo "Running seeders..."
composer seed

# Start Nginx in background
nginx -g "daemon off;" &

echo "Starting PHP-FPM..."

# Start PHP-FPM
exec php-fpm