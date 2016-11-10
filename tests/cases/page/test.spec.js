describe("Test case (page)", function() {
	var fs = require('fs');
	var Absurd = require('../../../index.js');

	it("page / js", function(done) {
		Absurd(require(__dirname + '/code.js')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@page toc, index:blank {\n  color: #000;\n}\n@page {\n  font-size: 12px;\n}\n');
			done();
		});
	});

	it("page / json", function(done) {
		Absurd(require(__dirname + '/code.json')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@page toc, index:blank {\n  color: #000;\n}\n@page {\n  font-size: 12px;\n}\n');
			done();
		});
	});

	it("page / css", function(done) {
		Absurd(fs.readFileSync(__dirname + '/code.css', 'utf8')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@page toc, index:blank {\n  color: #000;\n}\n@page {\n  font-size: 12px;\n}\n');
			done();
		});
	});

});