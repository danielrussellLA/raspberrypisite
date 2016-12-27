#!/bin/bash
git add .
git commit -m'rebasing'
git pull upstream master
echo '1. pulled most recent code from git.\n2. restarting server...'
node_serverPID=($(ps -ef | grep 'node server.js'))
kill ${node_serverPID[1]}
echo 'killed node server process at:'
echo ${node_serverPID[1]}
PORT=80 nohup node server.js > stdout.txt 2 > stderr.txt &
echo 'server now running indefinitely on port 80'