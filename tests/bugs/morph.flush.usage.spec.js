describe("Morph, flush usage /", function() {

	var api = require('../../index.js')();

	it("should compile to css", function(done) {
		api.add({
			body: { margin: "20px" }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  margin: 20px;\n}\n");
			done();
		});		
	});

	it("should compile to json", function(done) {
		api.morph("jsonify").add({
			body: { pos: "a" }
		}).compile(function (err, json) {
			expect(err).toBe(null);
			expect(json).toBeDefined();
			expect(JSON.stringify(json)).toBe('{"body":{"pos":"a"}}');
			done();
		}, { minify: true });		
	});

	it("should compile to css again", function(done) {
		api.unmorph().add({
			body: { padding: "20px" }
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body {\n  padding: 20px;\n}\n");
			done();
		});		
	});

});