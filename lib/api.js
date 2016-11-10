var path = require('path');
var extend = require('./helpers/Extend');

module.exports = function () {
	var _api = {},
		_rules = {},
		_storage = {},
		_plugins = {},
		_hooks = {};

	_api.getRules = function (stylesheet) {
		if (typeof stylesheet === 'undefined') {
			return _rules;
		} else {
			if (typeof _rules[stylesheet] === 'undefined') {
				_rules[stylesheet] = {};
			}
			return _rules[stylesheet];
		}
	};
	_api.getPlugins = function () {
		return _plugins;
	};
	_api.getStorage = function () {
		return _storage;
	};
	_api.flush = function (clearStorage) {
		if (clearStorage === true) {
			_storage = {};
		}
		_rules = {};
		_hooks = {};
		_api.defaultProcessor = require(__dirname + '/processors/css/CSS.js')();
		registerAPIMethods();
		return _api;
	};

	// CSS related methods
	_api.handlecss = function (parsed, path) {
		var plugins = _api.getPlugins();
		if (parsed && parsed.type === 'stylesheet' && parsed.stylesheet && parsed.stylesheet.rules) {
			var rules = parsed.stylesheet.rules;
			var rule;
			for (var i = 0; rule = rules[i]; i++) {
				switch (rule.type) {
					case 'rule': _api.handlecssrule(rule); break;
					case 'import': _api.handlecssimport(rule, path); break;
					default:
						if (plugins[rule.type]) {
							plugins[rule.type](_api, rule);
						}
						break;
				}
			}
		}
		return _api;
	};

	_api.handlecssimport = function (rule, cssPath) {
		cssPath = path.resolve(path.dirname(cssPath) + '/' + rule.import.replace(/'|"/g, ''));
		var ext = path.extname(cssPath);
		if (ext === '.js' || ext === '.json') {
			_api.import(require(cssPath));
		} else {
			try {
				_api.importCSS(require(cssPath));
			} catch (err) {
				_api.raw('@import ' + rule.import + ';');
			}
		}
		return _api;
	};

	_api.handlecssrule = function (rule, stylesheet) {
		var absurdObj = {}, absurdProps = {};
		if (rule.declarations && rule.declarations.length > 0) {
			for (var i = 0; decl = rule.declarations[i]; i++) {
				if (decl.type === 'declaration') {
					absurdProps[decl.property] = decl.value;
				}
			}
			if (rule.selectors && rule.selectors.length > 0) {
				for (var i = 0; selector = rule.selectors[i]; i++) {
					absurdObj[selector] = extend({}, absurdProps);
				}
			}
			_api.add(absurdObj, stylesheet);
		}
		return _api;
	};

	// hooks
	_api.addHook = function (method, callback) {
		if (!_hooks[method]) _hooks[method] = [];
		var isAlreadyAdded = false;
		for (var i = 0; c = _hooks[method][i]; i++) {
			if (c === callback) {
				isAlreadyAdded = true;
			}
		}
		isAlreadyAdded === false ? _hooks[method].push(callback) : null;
	};
	_api.callHooks = function (method, args) {
		if (_hooks[method]) {
			for (var i = 0; c = _hooks[method][i]; i++) {
				if (c.apply(_api, args) === true) return true;
			}
		}
		return false;
	};

	// internal variables
	_api.numOfAddedRules = 0;
	_api.defaultProcessor = require(__dirname + '/processors/css/CSS.js')();

	_api.scope = function (scope) {
		if (scope && typeof scope === 'string') {
			_api.scopeSelector = scope;
		} else {
			_api.scopeSelector = false;
		}
		return _api;
	};

	function registerAPIMethods() {
		var methods = require('./methods');
		for (var prop in methods) {
			_api[prop] = (function (method) {
				return function () {
					var func = methods[method](_api);
					if (_api.callHooks(method, arguments)) return _api;
					return func.apply(_api, arguments);
				};
			})(prop);
		};
	};
	function registerPlugins() {
		var plugins = require('./processors/css/plugins');
		for (var plugin in plugins) {
			_api.plugin(plugin, plugins[plugin]());
		}
	};
	function registerOrganic() {
		require('./processors/css/organic')(_api);
	};

	registerAPIMethods();
	registerPlugins();
	registerOrganic();

	return _api;

};