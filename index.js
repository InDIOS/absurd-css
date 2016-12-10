module.exports = function (func) {
	api = require('./lib/api.js')();
	if (typeof func === 'function') {
		func(api);
	} else if (typeof func === 'string') {
		api.importCSS(func);
	} else if (typeof func === 'object') {
		api.import(func);
	}
	return api;
};
