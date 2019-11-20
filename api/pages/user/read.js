'use strict';
const readService = require('../../services/user/read');

module.exports = (req, res) => {
	readService(req, res, null);
}