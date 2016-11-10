describe("Test case (supports)", function() {
	var fs = require('fs');
	var Absurd = require('../../../index.js');

	it("supports / js", function(done) {
		Absurd(require(__dirname + '/code.js')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header{font-size: 20px;}@supports (display: flex) or (display: box){.header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

	it("supports / json", function(done) {
		Absurd(require(__dirname + '/code.json')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header{font-size: 20px;}@supports (display: flex) or (display: box){.header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

	it("supports / css", function(done) {
		Absurd(fs.readFileSync(__dirname + '/code.css', 'utf8')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('.header{font-size: 20px;}@supports (display: flex) or (display: box) {.header{font-size: 30px;}}');
			done();
		}, { minify: true });
	});

});