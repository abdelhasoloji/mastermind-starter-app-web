#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="/opt/mastermind/apps/juriscope/web-repo"
TARGET="/var/www/juriscope/dev"

cd "$REPO_DIR"
git pull --ff-only origin main

npm ci
npm run build

sudo mkdir -p "$TARGET"
sudo rsync -a --delete dist/ "$TARGET/"

sudo chown -R www-data:www-data /var/www/juriscope
sudo find /var/www/juriscope -type d -exec chmod 755 {} \;
sudo find /var/www/juriscope -type f -exec chmod 644 {} \;

sudo systemctl reload caddy
