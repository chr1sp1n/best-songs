'use strict';

const config = require('config');
const errorsMaker = require('../../shared/errors');
const logger = require('../../shared/logger');
const googleAuth = require('../../services/google-auth');

module.exports = (req, res) => {

	var genericError = () =>{
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

	if(!req.body.reqUser || !req.body.reqUser.email) {
		genericError();
		return;
	}

	switch(req.body.reqUser.provider){
		case 'google':
			googleAuth(req, res);
			return;
		// case 'facebook':
		// 	res.end( JSON.stringify(req.body.reqUser) );
		// 	break;
		// case 'linkedin':
		// 	res.end( JSON.stringify(req.body.reqUser) );
		// 	break;
		default:
			require('../../services/auth').signIn(req, res);
			return;
	}



}