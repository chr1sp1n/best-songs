'use strict';

const config = require('config');
const errorsMaker = require('../shared/errors');
const logger = require('../shared/logger');
const dbQuery = require('../services/db/connection.js');
const mysql = require('mysql');

module.exports = (req, res) => {

	if(
		!req.body ||
		!req.body.id_best_songs ||
		!( parseInt(req.body.id_best_songs) > 0 )
	){
		var apiResp = {
			errors: errors([{
				status: 500,
				code: 'INVALID_PARAMETER',
				message: 'Invalid parameter'
			}]),
			meta: config.get('meta')
		}

		res.statusCode = 200;
		apiResp.errors.forEach( (err) => {
			if(err.status >= 400) res.statusCode = err.status;
		});

		res.end( JSON.stringify(apiResp) );
		return;
	}


	dbQuery(

		'call `notes`.createUpdate(' +
			mysql.escape(req.body.id_best_songs) 	+ ',' +	 // id_best_songs
			mysql.escape(req.user.id_user) 			+ ',' +  // data
			mysql.escape(req.body.title) 			+ ',' +  // title
			mysql.escape(req.body.rating) 			+ ',' +  // rating
			mysql.escape(req.body.tags) 			+ ',' +  // tags
			mysql.escape(req.body.youtube_url) 		+ ',' +  // youtube_url
			mysql.escape(req.body.data) 			+ ',' +  // data
			mysql.escape(req.body.state) 			+ 		 // state
		')',

		(result, fields, errs) => {

			var errors = [];

			if(result && result.length < 2){
				errors.push({
					status: 500,
					code: 'GENERIC_DB_ERROR',
					message: 'Generic database error'
				});
			}else{
				if( errs.length == 0 && result[0].length == 0 ) {
					errors.push({
						status: 500,
						code: 'ITEM_NOT_FOUND',
						message: 'Item not found'
					});
				}
			}

			var apiResp = {
				data: (result.length)? result[0][0] : {},
				errors: errorsMaker(errors),
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