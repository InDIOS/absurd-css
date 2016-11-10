var processor = require('./CSS')();

exports.charset = function () {
	return function (api, charsetValue) {
		if (typeof charsetValue === "string") {
			api.raw("@charset: \"" + charsetValue + "\";");
		} else if (typeof charsetValue === "object") {
			charsetValue = charsetValue.charset.replace(/:/g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '');
			api.raw("@charset: \"" + charsetValue + "\";");
		}
	};
};

exports.document = function () {
	return function (api, value) {
		if (typeof value === "object") {
			var stylesheet = '';
			stylesheet += '@' + value.vendor + 'document';
			stylesheet += ' ' + value.document;
			if (value.rules && value.rules.length) {
				for (var i = 0; rule = value.rules[i]; i++) {
					api.handlecssrule(rule, stylesheet);
				}
			} else if (typeof value.styles !== "undefined") {
				api.add(value.styles, stylesheet);
			}
		}
	};
};

exports.keyframes = function () {
	return function (api, value) {
		if (typeof value === "object") {
			// js or json
			var frames;
			if (typeof value.frames !== "undefined") {
				frames = value.frames;
				// css
			} else if (typeof value.keyframes !== "undefined") {
				frames = {};
				for (var i = 0; rule = value.keyframes[i]; i++) {
					if (rule.type === "keyframe") {
						var f = frames[rule.values] = {};
						for (var j = 0; declaration = rule.declarations[j]; j++) {
							if (declaration.type === "declaration") {
								f[declaration.property] = declaration.value;
							}
						}
					}
				}
			}
			if (api.jsonify) {
				var r = {};
				r.keyframes = {
					name: value.name,
					frames: frames
				};
				api.add(r);
			} else {
				var absurd = require('../../../')();
				absurd.add(frames).compile(function (err, css) {
					var content = '@keyframes ' + value.name + " {\n";
					content += css;
					content += "}";
					content = content + "\n" + content.replace("@keyframes", "@-webkit-keyframes");
					api.raw(content);
				}, { combineSelectors: false });
			}
		}
	};
};

exports.media = function () {
	return function (api, value) {
		if (typeof value === "object") {
			var content = '@media ' + value.media + " {\n";
			var rules = {}, json = {};
			for (var i = 0; rule = value.rules[i]; i++) {
				var
					r, rjson;
				if (rule.selectors) {
					r = rules[rule.selectors.toString()] = {};
					rjson = json[rule.selectors.toString()] = {};
					if (rule.type === "rule") {
						for (var j = 0; declaration = rule.declarations[j]; j++) {
							if (declaration.type === "declaration") {
								r[declaration.property] = declaration.value;
								rjson[declaration.property] = declaration.value;
							}
						}
					}
				}
			}
			content += processor({ mainstream: rules });
			content += "}";
			if (api.jsonify) {
				api.add(json, '@media ' + value.media);
			} else {
				api.raw(content);
			}
		}
	};
};

exports.namespace = function () {
	return function (api, value) {
		if (typeof value === "string") {
			api.raw("@namespace: \"" + value + "\";");
		} else if (typeof value === "object") {
			value = value.namespace.replace(/: /g, '').replace(/'/g, '').replace(/"/g, '').replace(/ /g, '').replace(/:h/g, 'h');
			api.raw("@namespace: \"" + value + "\";");
		}
	};
};

exports.page = function () {
	return function (api, value) {
		if (typeof value === "object") {
			var content = "";
			if (value.selectors.length > 0) {
				content += "@page " + value.selectors.join(", ") + " {\n";
			} else {
				content += "@page {\n";
			}
			for (var i = 0; declaration = value.declarations[i]; i++) {
				if (declaration.type === "declaration") {
					content += "  " + declaration.property + ": " + declaration.value + ";\n";
				}
			}
			content += "}";
			api.raw(content);
		}
	};
};

exports.supports = function () {
	return function (api, value) {
		if (typeof value === "object") {
			var content = '@supports ' + value.supports + " {\n";
			var rules = {};
			for (var i = 0; rule = value.rules[i]; i++) {
				var r = rules[rule.selectors.toString()] = {};
				if (rule.type === "rule") {
					for (var j = 0; declaration = rule.declarations[j]; j++) {
						if (declaration.type === "declaration") {
							r[declaration.property] = declaration.value;
						}
					}
				}
			}
			content += processor({ mainstream: rules });
			content += "}";
			api.raw(content);
		}
	};
};