describe("Test case (Document)", function() {

	var fs = require('fs');	
	var Absurd = require('../../../index.js');

	it("Document / js", function(done) {
		Absurd(require(__dirname + '/code.js')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@-moz-document url-prefix(){.ui-select .ui-btn select{opacity: .0001;}}');
			done();
		}, { minify: true });
	});

	it("Document / json", function(done) {
		Absurd(require(__dirname + '/code.json')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@-moz-document url-prefix(){.ui-select .ui-btn select{opacity: .0001;}}');
			done();
		}, { minify: true });
	});

	it("Document / css", function(done) {
		Absurd(fs.readFileSync(__dirname + '/code.css', 'utf8')).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe('@-moz-document url-prefix(){.ui-select .ui-btn select{opacity: .0001;}}');
			done();
		}, { minify: true });
	});

});