#!/usr/bin/env bash

echo 'deploy front-end: process start'

set -e

APP_DIR=/var/www/supersite.com/supersite-frontend

set -x

echo 'pull latest code'
cd $APP_DIR
git pull

echo 'install dependencies'
npm install

echo 'build app'
npm run build

echo 'deploy front-end: process done'
