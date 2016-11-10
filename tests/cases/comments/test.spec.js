describe("Test case (Comments)", function() {

	var fs = require('fs');
	var Absurd = require('../../../index.js');

	it("Comments / css", function(done) {
		Absurd(fs.readFileSync(__dirname + '/code.css', 'utf8')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('body {\n  foo: \'bar\';\n}\n');
			done();
		});
	});

});