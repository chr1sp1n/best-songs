'use strict';

const config = require('config');
const logger = require('../shared/logger');
const errorsMaker = require('../shared/errors');
const dbQuery = require('./db/connection');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');


module.exports = {

	signIn: (req, res, user = null) => {

		user = (user)? user : req.body.reqUser;

		dbQuery(
			'call `notes`.user_read(' +
				mysql.escape(0)						 	+
				',' + mysql.escape(user.email)			+
				',' + mysql.escape((user.password && user.password != '')? user.password : null) +
				',' + mysql.escape(null)	 			+
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
					if( errs.length == 0 ){
						if( result[0].length == 1 ) {
							require('./user/update')(req, res, result[0][0], true);
							return;
						}
						errors.push({
							status: 401,
							code: 'UNAUTHORIZED',
							message: 'Sign-in fail'
						});
					}else{
						errors.push({
							status: 500,
							code: 'GENERIC_DB_ERROR',
							message: 'Generic database error'
						});
					}
				}

				var apiResp = {
					data: (result && result.length > 0)? result[0][0] : {},
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
	},

	makeToken: (data) => {
		return jwt.sign(
			data,
			config.auth.secret,
			{
				expiresIn: config.auth.expiration,
			}
		);
	}

}