'use strict';
const createService = require('../../services/user/update');

module.exports = (req, res) => {
	createService(req, res, null, false);
}