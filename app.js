var express = require('express');
var app = express();

var fs = require('fs');
var https = require('https');
var key = fs.readFileSync('./ssl/key.pem');
var cert = fs.readFileSync('./ssl/cert.pem')
var host = '192.168.0.4';
var port = 3000;

var https_options = { key: key, cert: cert };

app.use('/',express.static(__dirname + '/public'));

server = https.createServer(https_options, app).listen(port);
console.log('HTTPS Server listening on %s:%s', host, port);
