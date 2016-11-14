var extend = require('./helpers/Extend');
var colorLuminance = require('./helpers/ColorLuminance');

function addScope(selector, scope) {
	selector = selector.trim();
	var prefix = selector.charAt(0);
	if (~selector.indexOf('>') || ~selector.indexOf('+') || ~selector.indexOf('~')) {
		if (~selector.indexOf('>')) selector = addScopeToList(selector, scope, ' > ');
		else if (~selector.indexOf('+')) selector = addScopeToList(selector, scope, ' + ');
		else if (~selector.indexOf('~')) selector = addScopeToList(selector, scope, ' ~ ');
	} else if (prefix === '.' || prefix === '#' || prefix === '[') {
		selector = scope + selector;
	} else if (~selector.indexOf(':')) {
		var parts = selector.split(':');
		selector = parts[0] + scope + ':' + parts.slice(1).join(':');
	} else if (prefix !== '@') {
		var parts = selector.split(' ');
		selector = parts[0] + scope + ' ' + parts.slice(1).join(' ');
	}
	return selector.trim();
}

function addScopeToList(selector, scope, separator) {
	var sel = selector.split(separator.trim());
	selector = sel.map(function (select) {
		return addScope(select, scope);
	}).join(separator);
	return selector;
}

exports.add = function (api) {
	var prefixes = require('./helpers/Prefixes'),
		toRegister = [],
		options = {
			combineSelectors: true,
			preventCombining: ['@font-face']
		};

	var checkAndExecutePlugin = function (selector, prop, value, stylesheet, parentSelector) {
		var prefix = prefixes.nonPrefixProp(prop);
		var plugin = api.getPlugins()[prefix.prop];
		if (typeof plugin !== 'undefined') {
			var pluginResponse = plugin(api, value, prefix.prefix);
			if (pluginResponse) {
				addRule(selector, pluginResponse, stylesheet, parentSelector);
			}
			return true;
		} else {
			return false;
		}
	};
	var addRule = function (selector, props, stylesheet, parentSelector) {
		stylesheet = stylesheet || 'mainstream';
		// catching null values
		if (props === null || typeof props === 'undefined' || props === false) return;
		if (!parentSelector && !selector) selector = '';

		// classify
		if (typeof props.classify !== 'undefined' && props.classify === true) {
			props = typeof props.toJSON !== 'undefined' ? props.toJSON() : props.toString();
		}

		// multiple selectors
		if (/, ?/g.test(selector) && options.combineSelectors) {
			var parts = selector.replace(/, /g, ',').split(',');
			for (var i = 0; i < parts.length, p = parts[i]; i++) {
				addRule(p, props, stylesheet, parentSelector);
			}
			return;
		}

		// check for plugin
		if (checkAndExecutePlugin(null, selector, props, stylesheet, parentSelector)) {
			return;
		}

		// if array is passed
		if (typeof props.length !== 'undefined' && typeof props === 'object') {
			for (var i = 0; i < props.length; i++) {
				prop = props[i];
				if (prop) {
					addRule(selector, prop, stylesheet, parentSelector);
				}
			}
			return;
		}

		var _props = {},
			_selector = selector,
			_objects = {},
			_functions = {};

		// processing props
		for (var prop in props) {
			// classify
			if (props[prop] && typeof props[prop].classify !== 'undefined' && props[prop].classify === true) {
				props[prop] = typeof props[prop].toJSON !== 'undefined' ? props[prop].toJSON() : props[prop].toString();
			}
			var type = typeof props[prop];
			if (type !== 'object' && type !== 'function' && props[prop] !== false && props[prop] !== true) {
				if (checkAndExecutePlugin(selector, prop, props[prop], stylesheet, parentSelector) === false) {
					// moving the selector to the top of the chain
					if (_selector.indexOf('^') === 0) {
						_selector = _selector.substr(1, _selector.length - 1) + (typeof parentSelector !== 'undefined' ? ' ' + parentSelector : '');
					} else {
						_selector = typeof parentSelector !== 'undefined' ? parentSelector + ' ' + selector : selector;
					}
					_props[prop] = props[prop];
					prefixes.addPrefixes(prop, _props);
				}
			} else if (type === 'object') {
				_objects[prop] = props[prop];
			} else if (type === 'function') {
				_functions[prop] = props[prop];
			}
		}

		toRegister.push({
			selector: _selector,
			props: _props,
			stylesheet: stylesheet
		});

		for (var prop in _objects) {
			// check for pseudo classes			
			if (prop.charAt(0) === ':') {
				addRule(selector + prop, _objects[prop], stylesheet, parentSelector);
				// check for ampersand operator
			} else if (/&/g.test(prop)) {
				if (/, ?/g.test(prop) && options.combineSelectors) {
					var parts = prop.replace(/, /g, ',').split(',');
					for (var i = 0; i < parts.length, p = parts[i]; i++) {
						if (p.indexOf('&') >= 0) {
							addRule(p.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
						} else {
							addRule(p, _objects[prop], stylesheet, typeof parentSelector !== 'undefined' ? parentSelector + ' ' + selector : selector);
						}
					}
				} else {
					addRule(prop.replace(/&/g, selector), _objects[prop], stylesheet, parentSelector);
				}
				// check for media query
			} else if (prop.indexOf('@media') === 0 || prop.indexOf('@supports') === 0) {
				addRule(selector, _objects[prop], prop, parentSelector);
				// check for media query
			} else if (selector.indexOf('@media') === 0 || prop.indexOf('@supports') === 0) {
				addRule(prop, _objects[prop], selector, parentSelector);
				// moving the selector to the top of the chain
			} else if (selector.indexOf("^") === 0) {
				// selector, props, stylesheet, parentSelector
				addRule(
					selector.substr(1, selector.length - 1) + (typeof parentSelector !== 'undefined' ? ' ' + parentSelector : '') + ' ' + prop,
					_objects[prop],
					stylesheet
				);
				// check for plugins
			} else if (checkAndExecutePlugin(selector, prop, _objects[prop], stylesheet, parentSelector) === false) {
				addRule(prop, _objects[prop], stylesheet, (parentSelector ? parentSelector + ' ' : '') + selector);
			}
		}

		for (var prop in _functions) {
			var o = {};
			o[prop] = _functions[prop]();
			addRule(selector, o, stylesheet, parentSelector);
		}

	};

	var add = function (rules, stylesheet, opts) {

		if (api.scopeSelector) {
			var scope = {};
			var keys = Object.keys(rules);
			for (var i = 0; i < keys.length; i++) {
				var selector = keys[i];
				if (~selector.indexOf(',')) {
					selector = addScopeToList(selector, api.scopeSelector, ', ');
				} else if (~selector.indexOf('>')) {
					selector = addScopeToList(selector, api.scopeSelector, ' > ');
				} else if (~selector.indexOf('+')) {
					selector = addScopeToList(selector, api.scopeSelector, ' + ');
				} else if (~selector.indexOf('~')) {
					selector = addScopeToList(selector, api.scopeSelector, ' ~ ');
				} else {
					selector = addScope(selector, api.scopeSelector);
				}
				scope[selector] = rules[keys[i]];
			}
			rules = scope;
		}

		if (api.jsonify) {
			extend(api.getRules(stylesheet || 'mainstream'), rules);
			return api;
		}

		try {

			toRegister = [];
			api.numOfAddedRules += 1;

			if (typeof stylesheet === 'object' && typeof opts === 'undefined') {
				options = {
					combineSelectors: typeof stylesheet.combineSelectors !== 'undefined' ? stylesheet.combineSelectors : options.combineSelectors,
					preventCombining: options.preventCombining.concat(stylesheet.preventCombining || [])
				};
				stylesheet = null;
			}
			if (typeof opts !== 'undefined') {
				options = {
					combineSelectors: opts.combineSelectors || options.combineSelectors,
					preventCombining: options.preventCombining.concat(opts.preventCombining || [])
				};
			}

			var typeOfPreprocessor = api.defaultProcessor.type, uid;

			for (var selector in rules) {
				addRule(selector, rules[selector], stylesheet || 'mainstream');
			}

			// looping through the rules for registering
			for (var i = 0; i < toRegister.length; i++) {
				var stylesheet = toRegister[i].stylesheet,
					selector = toRegister[i].selector,
					props = toRegister[i].props,
					allRules = api.getRules(stylesheet);
				var pc = options && options.preventCombining ? '|' + options.preventCombining.join('|') : '';
				var uid = pc.indexOf('|' + selector.replace(/^%.*?%/, '')) >= 0 ? '~~' + api.numOfAddedRules + '~~' : '';
				// overwrite already added value
				var current = allRules[uid + selector] || {};
				for (var propNew in props) {
					var value = props[propNew];
					propNew = uid + propNew;
					if (typeof value !== 'object') {
						if (typeOfPreprocessor === 'css') {
							// appending values
							if (value.toString().charAt(0) === '+') {
								if (current && current[propNew]) {
									current[propNew] = current[propNew] + ', ' + value.substr(1, value.length - 1);
								} else {
									current[propNew] = value.substr(1, value.length - 1);
								}
							} else if (value.toString().charAt(0) === '>') {
								if (current && current[propNew]) {
									current[propNew] = current[propNew] + ' ' + value.substr(1, value.length - 1);
								} else {
									current[propNew] = value.substr(1, value.length - 1);
								}
							} else {
								current[propNew] = value;
							}
						} else {
							current[propNew] = value;
						}

					}
				}
				allRules[uid + selector] = current;
			}

			return api;

		} catch (err) {
			throw new Error('Error adding: ' + JSON.stringify({ rules: rules, error: err.toString() }));
		}
	};
	return add;
};

exports.compile = function (api) {
	return function (callback, options) {
		if (typeof callback === 'object') {
			options = callback;
			callback = function () { };
		} else if (!callback && !options) {
			callback = function () { };
		}

		var _defaultOptions = {
			combineSelectors: true,
			minify: false,
			keepCamelCase: false,
			processor: api.defaultProcessor,
			api: api
		};

		options = extend(_defaultOptions, options || {});

		return options.processor(api.getRules(), function (err, result) {
			api.flush(true);
			callback(err, result);
		}, options);
	};
};

exports.darken = function () {
	return function (color, percents) {
		return colorLuminance(color, -(percents / 100));
	};
};

exports.lighten = function () {
	return function (color, percents) {
		return colorLuminance(color, percents / 100);
	};
};

exports.define = function (api) {
	return function (prop, value) {
		if (!api.getStorage().__defined) api.getStorage().__defined = {};
		api.getStorage().__defined[prop] = value;
		return api;
	};
};

exports.hook = function (api) {
	return function (method, callback) {
		api.addHook(method, callback);
		return api;
	};
};

exports.import = function (API) {
	function importFile(js, callback) {
		if (typeof js === 'object') {
			API.add(js);
		} else {
			try {
				if (typeof callback === 'function') {
					js(API, callback);
				} else {
					js(API);
				}
			} catch (err) {
				console.log('Error: ', err, err.stack);
			}
		}
	}

	return function (imports, callback) {
		if (typeof imports === 'object' && Array.isArray(imports)) {
			for (var i = 0, len = imports.length; i < len; i++) {
				var p = imports[i];
				if (typeof p === 'function' || typeof p === 'object') {
					importFile(p, callback);
				}
			}
		} else if (typeof imports === 'function' || typeof imports === 'object') {
			importFile(imports, callback);
		}
		return API;
	};
};

exports.importCSS = function (api) {
	var CSSParse = require('./helpers/CSSParse');
	return function (cssData) {
		try {
			var parsed = CSSParse(cssData);
			api.handlecss(parsed, '');
		} catch (err) {
			console.log('Error during importing of css data', err, err.stack);
		}
		return api;
	};
};

var metamorphosis = {
	jsonify: function (api) {
		api.jsonify = true;
	},
	'dynamic-css': function (api) {
		api.dynamicCSS = true;
	}
};

exports.morph = function (api) {
	return function (type) {
		if (metamorphosis[type]) {
			api.flush();
			metamorphosis[type](api);
		}
		return api;
	};
};

exports.unmorph = function (api) {
	return function () {
		api.jsonify = false;
		api.dynamicCSS = false;
		return api;
	};
};

exports.plugin = function (api) {
	var plugin = function (name, func) {
		api.getPlugins()[name] = func;
		return api;
	};
	return plugin;
};

exports.raw = function (api) {
	return function (raw) {
		var o = {}, v = {};
		var id = '____raw_' + api.numOfAddedRules;
		v[id] = raw;
		o[id] = v;
		api.add(o);
		return api;
	};
};

exports.rawImport = function (api) {
	return function (fileContent) {
		if (typeof fileContent === 'string') {
			api.raw(fileContent);
		} else {
			for (var i = 0, len = fileContent.length; i < len; i++) {
				p = fileContent[i];
				api.raw(fileContent);
			}
		}
		return api;
	};
};

exports.register = function (api) {
	return function (method, func) {
		api[method] = func;
		return api;
	};
};

exports.storage = function (api) {
	var store = api.getStorage();
	var storage = function (name, value) {
		if (typeof value !== 'undefined') {
			store[name] = value;
		} else if (typeof name === 'object') {
			for (var prop in name) {
				if (Object.prototype.hasOwnProperty.call(name, prop)) {
					storage(prop, name[prop]);
				}
			}
		} else {
			if (store[name]) {
				return store[name];
			} else {
				throw new Error('There is no data in the storage associated with \'' + name + '\'');
			}
		}
		return api;
	};
	return storage;
};