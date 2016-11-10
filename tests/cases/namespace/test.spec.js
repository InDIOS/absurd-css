describe("Test case (namespace)", function() {
	var fs = require('fs');
	var Absurd = require('../../../index.js');

	it("namespace / js", function(done) {
		Absurd(require(__dirname + '/code.js')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@namespace: "http://www.w3.org/1999/xhtml";\n');
			done();
		});
	});

	it("namespace / json", function(done) {
		Absurd(require(__dirname + '/code.json')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@namespace: "http://www.w3.org/1999/xhtml";\n');
			done();
		});
	});

	it("namespace / css", function(done) {
		Absurd(fs.readFileSync(__dirname + '/code.css', 'utf8')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@namespace: "http://www.w3.org/1999/xhtml";\n');
			done();
		});
	});

});