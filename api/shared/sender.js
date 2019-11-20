'use strict';

const logger = require('./logger');

module.exports = (res, responseObj) => {
	responseObj.errors.forEach( err => {
		res.statusCode = ( err.status > res.statusCode ) ? err.status : res.statusCode;
	});
	res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.end( JSON.stringify(responseObj) );
	logger.debug('Response sent to client with status code: ' + res.statusCode);
}