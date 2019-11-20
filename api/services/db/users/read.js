'use strict';

const config = require('config');
const errorsMaker = require('../../../shared/errors');
const dbQuery = require('../connection');
const mysql = require('mysql');

module.exports = (user, sort = null) => {

	return new Promise( (resolve, reject) => {

		dbQuery(

			'call `notes`.user_read(' +
				mysql.escape( (user.id_user) ? user.id_user : 0 )	 				+
				',' + mysql.escape( (user.email) ? user.email : null )				+
				',' + mysql.escape(
					(user.password && user.password != '')? user.password : null
				) 	+
				',' + mysql.escape(sort)	 										+
			')',

			(result, fields, errs) => {
				if( errs.length == 0 ) {
					resolve(result);
					return;
				}
				reject(errs);
			}

		)

	});

}

