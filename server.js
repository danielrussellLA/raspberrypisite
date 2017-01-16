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
    var http = require('http');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    // helpers
    var helpers = require('./server_helpers.js');

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
    var PORT = process.env.PORT || 3000;
    var server = http.createServer(app).listen(PORT);
    console.log('listening on port '+PORT);
}
