'use strict';

const config = require('config');
const errors = require('../shared/errors');
const dbQuery = require('../services/db/connection.js');
const logger = require('../shared/logger');
const mysql = require('mysql');

module.exports = (req, res) => {

	var id_best_songs = (req.query && req.query.id_best_songs) ? req.query.id_best_songs : 0;
	var sorting = (req.query && req.query.sorting) ? req.query.sorting : null;
	dbQuery(
		'call `notes`.`read`(' +
			mysql.escape(id_best_songs) 			+
			', ' + mysql.escape(req.user.id_user) 	+
			', ' + mysql.escape(sorting) 			+
		')',

		(result, fields, errs) => {
			var apiResp = {
				data: result,
				errors: errors(errs),
				meta: config.get('meta')
			}

			res.statusCode = 200;
			apiResp.errors.forEach( (err) => {
				if(err.status >= 400) res.statusCode = err.status;
			});

			logger.debug('Response sent to client with status code: ' + res.statusCode);
			res.end( JSON.stringify(apiResp) );
		}
	);
}