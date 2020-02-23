'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Routes
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Http headers

// Base routes
app.use('/api', user_routes);
app.use('/api', artist_routes);

app.get('/test', function(req, res) {
    res.status(200).send({message: '👽 Hello World..!!'})
});

module.exports = app;
