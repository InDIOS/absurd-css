describe("Test case (media)", function() {
	var fs = require('fs');
	var Absurd = require('../../../index.js');

	it("media / js", function(done) {
		Absurd(require(__dirname + '/code.js')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header{font-size: 20px;}@media print{header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

	it("media / json", function(done) {
		Absurd(require(__dirname + '/code.json')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header{font-size: 20px;}@media print{header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

	it("media / css", function(done) {
		Absurd(fs.readFileSync(__dirname + '/code.css', 'utf8')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('header{font-size: 20px;}@media all (max-width: 950px) {header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

});