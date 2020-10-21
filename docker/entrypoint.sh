#!/bin/sh

if mountpoint -q /frontend; then
    echo "清空 /frontend"
    rm -rf /frontend/*
    echo "移动 dist.tar.gz -> /frontend"
    cp /dist/dist.tar.gz /frontend
    cd /frontend
    echo "解压 dist.tar.gz"
    tar xf dist.tar.gz --strip-components 1
    echo "删除 dist.tar.gz"
    rm dist.tar.gz
else
    echo "/frontend is not a mountpoint."
    echo "You can either:"
    echo "- re-run this container with -v /usr/share/nginx/frontend:/frontend"
fi