describe("Test case (colon-space)", function() {

	var fs = require('fs');		
	var Absurd = require('../../../index.js');

	it("colon-space / css", function(done) {
		Absurd(fs.readFileSync(__dirname + '/code.css', 'utf8')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('a {\n  margin: auto;\n  padding: 0;\n}\n');
			done();
		});
	});

});