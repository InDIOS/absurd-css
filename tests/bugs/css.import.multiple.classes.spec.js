describe("Should compile properly whihe multiple classes selector is used", function() {

	var fs = require('fs');	
	var api = require('../../index.js')();

	it("should compile properly", function(done) {
		api.importCSS(fs.readFileSync(__dirname + "/../data/bugs/css.import.multiple.classes.css", 'utf8'));
		api.add({
			'header': {
				width: '100px',
				height: '100px'
			}
		})
		api.compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("header,footer,aside{display: block;}header{width: 100px;height: 100px;}");
			done();
		}, {minify: true});
	});

});