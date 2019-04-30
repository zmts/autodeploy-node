#!/usr/bin/env bash

echo 'deploy front-end: process start'

set -e

APP_DIR=/var/www/supersite.com/supersite-frontend

set -x

cd $APP_DIR
echo 'remove node_modules'
rm -r -f ./node_modules

echo 'pull latest code'
git reset --hard
git pull

echo 'install dependencies'
npm install

echo 'build app'
npm run build

echo 'deploy front-end: process done'
