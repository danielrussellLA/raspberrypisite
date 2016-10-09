#!/bin/bash
concurrently 'sass --watch css/sass:css --style compressed' 'nodemon server.js'
