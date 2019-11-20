'use strict';

const config = require('config');
const colors = require('colors');

const levels = [
	'error',		// 0
	'warning',		// 1
	'info',			// 2
	'debug'			// 3
];

var getLevel = () => {
	return levels.indexOf(config.get('log_level'));
}

var getDateTime = () => {
	return new Date().toISOString() + " ";
}

module.exports = {

	debug: (mesg) => {
		if( getLevel() > 2) {
			console.log( getDateTime() + colors.gray('[DEBG]') + ' ' + mesg);
		}
	},
	info: (mesg) =>{
		if( getLevel() > 1) {
			console.info( getDateTime() + colors.cyan('[INFO]') + ' ' +  mesg);
		}
	},
	warning: (mesg) =>{
		if( getLevel() > 0) {
			console.warn( getDateTime() + colors.yellow('[WARN]') + ' ' +  mesg);
		}
	},
	error: (mesg) =>{
		if( getLevel() > -1) {
			console.error( getDateTime() + colors.red('[ERRO]') + ' ' +  mesg);
		}
	}

}