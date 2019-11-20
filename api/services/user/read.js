'use strict';
const config = require('config');
const errorsMaker = require('../../shared/errors');
const logger = require('../../shared/logger');
const dbQuery = require('../db/connection.js');
const mysql = require('mysql');

module.exports = (req, res, user) => {
	logger.debug('Response sent to client with status code: ' + res.statusCode);
	res.end( JSON.stringify(apiResp) );
}