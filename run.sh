#!/bin/bash
concurrently 'sass --watch css/sass:css/sass --style compressed' 'nodemon server.js'
