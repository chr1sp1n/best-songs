'use strict';
const updateService = require('../../services/user/update');

module.exports = (req, res) => {
	updateService(req, res, null, false);
}