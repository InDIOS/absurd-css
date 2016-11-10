module.exports = function (text, options) {
	var delimiters = ['{%', '%}'];
	delimiters = options && options.api && typeof options.api.delimiters ? options.api.delimiters : delimiters;
	var re = new RegExp(delimiters[0] + '(.+?)' + delimiters[1],'g'),
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
		code = 'with(obj) { var r=[];\n',
		cursor = 0,
		result,
		match;
	var add = function (line, js) {
		if (js) {
			if (line.match(reExp)) js = line + '\n';
			else js = 'r.push(' + line.trim() + ');\n';
			code += js;
		} else {
			if (line !== '') js = 'r.push("' + line.replace(/"/g, '\\"') + '");\n';
			else js = '';
			code += js;
		}
		return add;
	};
	while (match = re.exec(text)) {
		add(text.slice(cursor, match.index))(match[1], true);
		cursor = match.index + match[0].length;
	}
	add(text.substr(cursor, text.length - cursor));
	code = (code + 'return r.join("");}').replace(/[\r\t\n]/g, ' ');
	try { result = new Function('obj', code).apply(options, [options]); }
	catch (err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
	return result;
};
