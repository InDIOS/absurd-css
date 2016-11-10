var args = require('../helpers/args');
var units = require('../helpers/units');

exports.blur = function (value) {
	return {
		'-wms-filter': 'blur(' + value + 'px)'
	};
};

exports.brightness = function (value) {
	return {
		'-wms-filter': 'brightness(' + value + ')'
	};
};

exports.contrast = function (value) {
	return {
		'-wms-filter': 'contrast(' + value + '%)'
	};
};

exports.dropshadow = function (value) {
	return {
		'-wms-filter': 'drop-shadow(' + value + ')'
	};
};

exports.invert = function (value) {
	return {
		'-wms-filter': 'invert(' + value + '%)'
	};
};

exports.saturate = function (value) {
	return {
		'-wms-filter': 'saturate(' + value + 'deg)'
	};
};

exports.sepia = function (value) {
	return {
		'-wms-filter': 'sepia(' + value + '%)'
	};
};

exports.transformto = function (value) {
	return {
		'-wmso-transform': value
	};
};

exports.size = function (value) {
	var argument = args(value), result = {};
	if (argument.length === 2) {
		if (argument[0] !== '') {
			result.width = units(argument[0]);
		}
		if (argument[1] !== '') {
			result.height = units(argument[1]);
		}
		return result;
	} else {
		return {
			width: units(argument[0]),
			height: units(argument[0])
		};
	}
};

exports.scaleto = function (value) {
	var argument = args(value),
		x = !argument[0] || argument[0] === '' ? 0 : argument[0],
		y = !argument[1] || argument[1] === '' ? 0 : argument[1];
	if (argument.length === 2) {
		return { "-ws-trf": ">scale(" + x + "," + y + ")" };
	}
};

exports.transparent = function (value) {
	var r = {};
	value = parseFloat(value);
	r['-s-filter'] = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (value * 100) + ')';
	r['filter'] = 'alpha(opacity=' + (value * 100) + ')';
	r['-m-opacity'] = value;
	r['opacity'] = value;
	r['KhtmlOpacity'] = value;
	return r;
};

exports.calc = function (value) {
	var argument = args(value), r = {};
	r['LhProperty'] = '0';
	r['~~1~~' + argument[0]] = '-webkit-calc(' + argument[1] + ')';
	r['~~2~~' + argument[0]] = '-moz-calc(' + argument[1] + ')';
	r['~~3~~' + argument[0]] = 'calc(' + argument[1] + ')';
	return r;
};

exports.cf = function (value) {
	var r = {}, clearing = {
		content: '" "',
		display: 'table',
		clear: 'both'
	};
	switch (value) {
		case 'before':
			r['&:before'] = clearing;
			break;
		case 'after':
			r['&:after'] = clearing;
			break;
		default:
			r['&:before'] = clearing;
			r['&:after'] = clearing;
			break;
	}
	return r;
};

var getMSColor = function (color) {
	color = color.toString().replace('#', '');
	if (color.length === 3) {
		var tmp = '';
		for (var i = 0; i < color.length; i++) {
			tmp += color[i] + color[i];
		}
		color = tmp;
	}
	return '#FF' + color.toUpperCase();
};

exports.gradient = function (value) {
	var argument = args(value);
	if (typeof value === 'string') {
		var deg = argument[argument.length - 1];
		if (deg.indexOf('deg') > 0) {
			deg = parseInt(argument.pop().replace('deg', ''));
		} else {
			deg = 0;
		}
		var numOfStops = argument.length,
			stepsPercents = Math.floor(100 / (numOfStops - 1)).toFixed(2),
			gradientValue = [],
			msGradientType = (deg >= 45 && deg <= 135) || (deg >= 225 && deg <= 315) ? 1 : 0,
			msStartColor = msGradientType === 0 ? getMSColor(argument[argument.length - 1]) : getMSColor(argument[0]),
			msEndColor = msGradientType === 0 ? getMSColor(argument[0]) : getMSColor(argument[argument.length - 1]);

		for (var i = 0; i < numOfStops; i++) {
			if (argument[i].indexOf('%') > 0) {
				gradientValue.push(argument[i]);
			} else {
				gradientValue.push(argument[i] + ' ' + (i * stepsPercents) + '%');
			}
		}
		gradientValue = deg + 'deg, ' + gradientValue.join(', ');

		return [
			{ 'background': '-webkit-linear-gradient(' + gradientValue + ')' },
			{ '~~1~~background': '-moz-linear-gradient(' + gradientValue + ')' },
			{ '~~2~~background': '-ms-linear-gradient(' + gradientValue + ')' },
			{ '~~3~~background': '-o-linear-gradient(' + gradientValue + ')' },
			{ '~~4~~background': 'linear-gradient(' + gradientValue + ')' },
			{ 'filter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr=\'' + msStartColor + '\', endColorstr=\'' + msEndColor + '\',GradientType=' + msGradientType + ')' },
			{ 'MsFilter': 'progid:DXImageTransform.Microsoft.gradient(startColorstr=\'' + msStartColor + '\',endColorstr=\'' + msEndColor + '\',GradientType=' + msGradientType + ')' }
		];
	}
	return {};
};

exports.grid = function (value) {
	var argument = args(value);
	if (argument.length === 2) {
		var res = {
			cf: 'both'
		};
		res[argument[1]] = {
			fl: 'l',
			'-mw-bxz': 'bb',
			wid: (100 / parseInt(argument[0])).toFixed(2) + '%'
		};
		return res;
	} else {
		return {};
	}
};

exports.moveto = function (value) {
	var argument = args(value),
		x = units(!argument[0] || argument[0] === '' ? 0 : argument[0], 'px'),
		y = units(!argument[1] || argument[1] === '' ? 0 : argument[1], 'px'),
		z = units(!argument[2] || argument[2] === '' ? 0 : argument[2], 'px');
	if (argument.length === 2) {
		return { "-ws-trf": ">translate(" + x + "," + y + ")" };
	} else if (argument.length === 3) {
		return { "-ws-trf": ">translate3d(" + x + "," + y + "," + z + ")" };
	}
};

exports.rotateto = function (value) {
	var argument = args(value);
	if (argument.length === 1) {
		return { "-ws-trf": ">rotate(" + units(argument[0], 'deg') + ")" };
	}
};