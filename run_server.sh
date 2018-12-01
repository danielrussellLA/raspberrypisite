#!/bin/bash
sudo nohup node server.js >> server_log.txt 2>&1 &
echo 'server started...'
