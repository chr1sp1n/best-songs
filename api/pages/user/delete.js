'use strict';
const deleteService = require('../../services/user/delete');

module.exports = (req, res) => {
	deleteService(req, res, null);
}