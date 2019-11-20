'use strict';

const logger = require('./logger');

module.exports = (errors) => {
	var errorsObject = [];

	if(typeof errors.forEach != 'function') return errorsObject;

	errors.forEach( (err) => {
		var status = err.status;
		var message = 'Generic error';

		if(err.message) message = err.message;
		if(err.sqlState) status = 500;
		if(err.sqlMessage) message = err.sqlMessage;

		errorsObject.push({
			status: status,
			code: err.code,
			title: 'Server error',
			detail: message
		});
	});


	errorsObject.forEach( (err) => {
		if(err) logger.error( err.title + ' - ' + err.detail + ' - (' + err.code + ') - HTTP_CODE: ' + err.status );
	});

	return errorsObject;
}