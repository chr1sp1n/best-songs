'use strict';

const mysql = require('mysql');
const config = require('config');
const logger = require('../../shared/logger');


module.exports = (query, callback) => {

	var con = mysql.createConnection( config.get('db') );

	con.connect(
		(connectionErr) => {

			if (config.get('throw_on_error') && connectionErr) throw connectionErr;

			if (connectionErr){
				callback(false, false, [connectionErr]);
				return;
			}

			logger.debug('Query: ' + query);

			con.query(query,
				(queryErr, result, fields) => {
					if (config.get('throw_on_error') && queryErr) throw queryErr;
					con.end(
						(endErr) => {
							if (config.get('throw_on_error') && endErr) throw endErr;
							var errs = [];
							if(queryErr) errs.push(queryErr);
							if(endErr) errs.push(endErr);
							callback(result, fields, errs);
						}
					);
				}
			);

		}
	);

}
