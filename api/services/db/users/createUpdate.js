'use strict';
const config = require('config');
const errorsMaker = require('../../shared/errors');
const logger = require('../../shared/logger');
const dbQuery = require('../db/connection.js');
const mysql = require('mysql');
const auth = require('../../services/auth');

module.exports = (req, res, user, signIn = false) => {

	user = (user) ? user : req.body.reqUser;

	dbQuery(

		'call `notes`.user_createUpdate(' +
			mysql.escape(user.id_user) 			+
			',' + mysql.escape(user.email) 		+
			',' + mysql.escape((user.password && user.password != '')? user.password : null) 	+
			',' + mysql.escape(user.name) 		+
			',' + mysql.escape(user.picture)	+
			',' + mysql.escape((signIn)?1:0)	+
			',' + mysql.escape(user.state)		+
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
				if( errs.length == 0 && result[1].affectedRows == 0 ) {
					errors.push({
						status: 500,
						code: 'ITEM_NOT_FOUND',
						message: 'Item not found'
					});
				}
			}

			var apiResp = {
				data: (result && result.length > 0)? result[0][0] : {},
				errors: errorsMaker(errs),
				meta: config.get('meta')
			}

			if(signIn) {
				apiResp.data.token = auth.makeToken({
					email: apiResp.data.email,
					id_user: apiResp.data.id_user
				})
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