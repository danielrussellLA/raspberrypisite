'use-strict';
var cluster = require('cluster');
if(cluster.isMaster) {
    // initialize clusters on startup
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    // dependencies

    // express
    var express = require('express');
    // middleware
    var https = require('https');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    // helpers
    var helpers = require('./server_helpers.js');
    var fs = require('fs');
    var privateKey = fs.readFileSync('./private.key', 'utf8');
    var certificate = fs.readFileSync('./engineeringdan_com.crt', 'utf8');

    var credentials = {key: privateKey, cert: certificate}; 
    var ip = '192.168.1.175'; // static ip address of raspberry pi

    // instantiate express app
    var app = express();

    // use middleware
    app.use(morgan('dev'));
    app.use(express.static(__dirname));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    // routes
    app.route('/content')
    .get(function(request, response){
        helpers.getData('data/data.json', response);
    })
    .post(function(request, response){
        helpers.writeData('data/data.json', request.body, request, response);
    });

    app.route('/postblog')
    .get(function(request, response){
        helpers.getData('blog-post-form.html', response);
    })
    .post(function(request, response){
        helpers.writeData('data/data.json', request.body, request, response);
    });

    app.route('/deleteblog')
    .get(function(request, response){
        helpers.getData('delete-blog-post.html', response);
    })
    .post(function(request, response){
        helpers.writeData('data/data.json', request.body, request, response);
    });

    app.route('/delete-single-blog-post')
    .post(function(request, response){
        helpers.deleteblog(request, response);
    });

    // create/run server
    var PORT = process.env.PORT || 443;
    var server = https.createServer(credentials, app).listen(PORT, ip);
    console.log('listening on port '+PORT);
}
