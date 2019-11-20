'use strict';
const updateService = require('./update');

module.exports = (req, res, user, signIn = false) => {
	updateService(req, res, user, signIn);
}