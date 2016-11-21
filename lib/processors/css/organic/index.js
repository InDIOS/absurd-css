var atoms = require('./lib/atoms');
var animate = require('./lib/animate');
var molecules = require('./lib/molecules');
var snippets = require('./helpers/snippets');

module.exports = function (absurd) {
	if (!absurd) return;
	// getting atoms and molecules
	for (var prop in molecules) {
		(function (molecule) {
			absurd.plugin(molecule, function (absurd, value) {
				return molecules[molecule](value);
			});
		})(prop);
	}
	absurd.plugin('atoms', function (absurd, value) {
		return atoms(value);
	});
	absurd.plugin('animate', function (absurd, value) {
		return animate(value);
	});
	// converting snippets to plugins
	for (var atom in snippets) {
		atom = atom.split(':');
		(function (pluginName) {
			absurd.plugin(pluginName, function (absurd, value, prefixes) {
				if (prefixes === false) prefixes = '';
				var snippet, result = {};
				if (snippet = snippets[pluginName + ':' + value]) {
					snippet = snippet.split(':');
					result[prefixes + snippet[0]] = snippet[1] || '';
				} else if (snippet = snippets[pluginName]) {
					snippet = snippet.split(':');
					var val = snippet[1];
					if (val) {
						if (typeof value === 'string') {
							value = value.split(' ');
						}
						for (var i = 0, len = value.length; i < len; i++) {
							var reg = new RegExp('(\\$(' + (i + 1) + ')+)');
							val = val.replace(reg, value[i]);
						}
						val = val.replace(/(\$[0-9])/g, '').trim();
					}
					result[prefixes + snippet[0]] = val || value;
				}
				return result;
			});
		})(atom.shift());
	}
};