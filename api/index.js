#!/usr/bin/env node

console.log('start');

'use strict';

//process.env.NODE_CONFIG_DIR = __dirname + "/config/";

const finalhandler = require('finalhandler');
const logger = require('./shared/logger');
const fs = require('fs');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const jwt = require('express-jwt');
const errorsMaker = require('./shared/errors');
const requireDir = require('require-dir');
const pages = requireDir('./pages');

app.use( helmet() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: false }) );


// routes

// homepage
app.get('/', (req, res) => {
	logger.debug("Client request: " + req.url);
	fs.readFile('./www/index.html', (err, html) => {
		if (config.get('throw_on_error') && err) throw err;
		if(err) {
			return finalhandler(req, res, {
				onerror: logger.error( err + ' - (' + err.code + ') - HTTP_CODE: 404' )
			})(err);
		}
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.end(html);
		logger.debug('Response sent to client with status code: ' + res.statusCode);
	});
});


//app.post('/test', pages.test);




// BestSongs API
app.options('/create', cors(config.cors), jwt({ secret: config.auth.secret }));
app.post('/create', cors(config.cors), jwt({ secret: config.auth.secret }), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	require('./pages/create')(req, res);
});

app.options('/read', cors(config.cors), jwt({ secret: config.auth.secret }));
app.get('/read', cors(config.cors), jwt({ secret: config.auth.secret }), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	require('./pages/read')(req, res);
});

app.options('/update', cors(config.cors), jwt({ secret: config.auth.secret }));
app.patch('/update', cors(config.cors), jwt({ secret: config.auth.secret }), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	require('./pages/update')(req, res);
});

app.options('/delete', cors(config.cors), jwt({ secret: config.auth.secret }));
app.delete('/delete', cors(config.cors), jwt({ secret: config.auth.secret }), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	require('./pages/delete')(req, res);
});
// BestSongs API - END


// UserAuth API
const pageAuthenticate = require('./pages/user/authenticate');
app.options('/users/authenticate', cors(config.cors));
app.post('/users/authenticate', cors(config.cors), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	pageAuthenticate(req, res);
});

app.options('/users/create', jwt({ secret: config.auth.secret }), cors(config.cors));
app.post('/users/create', cors(config.cors), jwt({ secret: config.auth.secret }), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	require('./pages/user/create')(req, res);
});

app.options('/users/read', jwt({ secret: config.auth.secret }), cors(config.cors));
app.get('/users/read', cors(config.cors), jwt({ secret: config.auth.secret }), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	require('./pages/user/read')(req, res);
});

app.options('/users/update', jwt({ secret: config.auth.secret }), cors(config.cors));
app.patch('/users/update', cors(config.cors), jwt({ secret: config.auth.secret }), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	require('./pages/user/update')(req, res);
});

app.options('/users/delete', jwt({ secret: config.auth.secret }), cors(config.cors));
app.delete('/users/delete', cors(config.cors), jwt({ secret: config.auth.secret }), (req, res) => {
	logger.debug("Client request: " + req.url);
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	require('./pages/user/delete')(req, res);
});

app.use( (err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		var apiResp = {
			errors: errorsMaker([{
				status: 401,
				code: 'SESSION_EXPIRED',
				message: 'Session expired'
			}]),
			meta: config.get('meta')
		}
		res.status(apiResp.errors[0].status);
		logger.debug('Response sent to client with status code: ' + res.statusCode);
		res.end( JSON.stringify(apiResp) );
	}
});

// UserAuth API - END




// app.options('/users/:function?', cors(config.cors));
// app.post('/users/:function?', cors(config.cors), (req, res) => {
// 	logger.debug("Client request: " + req.url);
// 	res.setHeader('Content-Type', 'application/json; charset=utf-8');
// 	require('./pages/users')(req, res);
// });


// Listener
app.listen( config.get('server.port'), (err) => {
	if(err) throw err;
	logger.info("Server running at http://" + config.get('server.hostname') + ":" + config.get('server.port') + "/");
});
