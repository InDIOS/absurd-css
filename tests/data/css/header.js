module.exports = function(A) {
	A.import(require(__dirname + '/config/colors.js'));
	A.import(require(__dirname + '/config/sizes.js'));
	A.import([
		require(__dirname + '/config/A.js'),
		require(__dirname + '/config/B.js')
	]);

}