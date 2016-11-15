#!/bin/bash
PORT=80 nohup node server.js > stdout.txt 2> stderr.txt &
echo 'server now running indefinitely on port 80'
echo 'to kill server, type "ps -ef | grep node" and then run "kill 1234" where "1234 is the PID of the node server.js process"'
