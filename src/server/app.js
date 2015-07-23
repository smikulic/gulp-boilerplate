var express = require('express');
var app = express();
var port = process.env.PORT || 7203;
var routes;

var environment = process.env.NODE_ENV;

console.log('About to start node server');
console.log('PORT=' + port);