#!/bin/bash
PORT=80 nohup node server.js > stdout.txt 2> stderr.txt &
