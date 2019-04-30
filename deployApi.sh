#!/usr/bin/env bash

echo 'deploy api: process start'

set -e

APP_DIR=/var/www/supersite.com/supersite-api
PM2_CONFIG=/var/www/deploy.supersite.com/autodeploy-node/supersite-api.pm2-config.json

set -x

cd $APP_DIR
echo 'remove node_modules'
rm -r -f ./node_modules

echo 'pull latest code'
git reset --hard
git pull

echo 'install dependencies'
npm install

echo 'restart app'
pm2 restart $PM2_CONFIG --env production

echo 'deploy api: process done'
