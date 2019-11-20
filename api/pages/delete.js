'use strict';

const config = require('config');
const errorsMaker = require('../shared/errors');
const logger = require('../shared/logger');
const dbQuery = require('../services/db/connection.js');
const mysql = require('mysql');

module.exports = (req, res) => {

	if(
		!req.query ||
		!req.query.id_best_songs ||
		!( parseInt(req.query.id_best_songs) > 0 )
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

	var errors = [];

	dbQuery(
		'call `notes`.`read`(' +
			mysql.escape(req.query.id_best_songs) +
			',' + mysql.escape(req.user.id_user.toString())	+
			', NULL' +
		')',

		(result, fields, errs) => {

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
				errors: errorsMaker(errors),
				meta: config.get('meta')
			}

			res.statusCode = 200;
			apiResp.errors.forEach( (err) => {
				if(err.status >= 400) res.statusCode = err.status;
			});

			if(apiResp.errors.length == 0 && result[0].length == 1){

				dbQuery(
					'call `notes`.createUpdate(' +
						mysql.escape(result[0][0].id_best_songs) 		+ ',' +	 // id_best_songs
						mysql.escape(req.user.id_user) 					+ ',' +	 // id user
						mysql.escape(result[0][0].title) 				+ ',' +  // title
						mysql.escape(result[0][0].rating) 				+ ',' +  // rating
						mysql.escape(result[0][0].tags) 				+ ',' +  // tags
						mysql.escape(result[0][0].youtube_url) 			+ ',' +  // youtube_url
						mysql.escape(result[0][0].data) 				+ ',' +  // data
						mysql.escape(0)				 					+ 		 // state
					')',

					(result, fields, errs) => {

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
							errors: errorsMaker(errs),
							meta: config.get('meta')
						}

						res.statusCode = 200;
						apiResp.errors.forEach( (err) => {
							if(err.status >= 400) res.statusCode = err.status;
						});

						logger.debug('Response sent to client with status code: ' + res.statusCode);
						res.end( JSON.stringify(apiResp) );
						return;
					}
				);

			}else{
				errs.push({
					status: 500,
					code: 'QUERY ERROR',
					message: 'Item not found'
				});
				apiResp.errors = errs;
				res.end( JSON.stringify(apiResp) );
				return;
			}

		}
	)

}