'use strict';
const config = require('config');
const errorsMaker = require('../shared/errors');
const logger = require('../shared/logger');
const dbQuery = require('./db/connection');
const mysql = require('mysql');
const googleVerifier = require('google-id-token-verifier');

module.exports = (req, res, callback) => {

	var user = req.body.reqUser

	googleVerifier.verify(

		user.idToken,
		config.social.google.ID_client,

		(err, tokenInfo) => {

			if (!err) {
				var errors = [];
				
				
				dbQuery(
					'call `notes`.userRead(' 
							+ mysql.escape(0)					+
						',' + mysql.escape(tokenInfo.email)		+
						',' + mysql.escape(null)	 			+
						',' + mysql.escape(null)	 			+
					')',

					(result, fields, errs) => {
						

						if(result && result.length < 2){
							errors.push({
								status: 500,
								code: 'GENERIC_DB_ERROR',
								message: 'Generic database error'
							});
						}else{
							if( errs.length == 0 ){
								if( result[0].length == 0 ) {
									require('./user/create')(req, res, {
										id_user: null,
										email: tokenInfo.email,
										password: null,
										name: tokenInfo.name,
										picture: tokenInfo.picture
									}, true);
									return;
								}
								require('./user/update')(req, res, result[0][0], true);
								return;
							}else{
								errors.push({
									status: 500,
									code: 'GENERIC_DB_ERROR',
									message: 'Generic database error'
								});
							}
						}
					}
				);

			}else{
				errors.push({
					status: 401,
					code: 'GOOGLE_AUTH_FAIL',
					message: 'Google authentication fail'
				});
			}

			if(errors.length > 0) {
				var apiResp = {
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
		}



	);

}