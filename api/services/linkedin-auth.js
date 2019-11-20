const logger = require('../shared/logger');
const errorsMaker = require('../shared/errors');

module.exports = (req, res) => {
	var apiResp = {
		errors: errorsMaker([{
			code: 'INVALID_PARAMETER',
			message: 'Invalid parameter'
		}]),
		meta: config.get('meta')
	}

	res.statusCode = 200;
	apiResp.errors.forEach( (err) => {
		if(err.status >= 400) res.statusCode = err.status;
	});

	logger.debug('Response sent to client with status code: ' + res.statusCode);
	res.end( JSON.stringify(apiResp) );
}