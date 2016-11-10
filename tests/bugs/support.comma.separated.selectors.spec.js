describe("Support comma separated selectors", function() {

	var api = require('../../index.js')();

	it("Support comma separated selectors", function(done) {
		api.add({
			"body, section, h1": {
				padding: "20px",
				"btn, i": { fontSize: "20px"}
			}
		}).compile(function(err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("body,section,h1{padding: 20px;}body btn,body i,section btn,section i,h1 btn,h1 i{font-size: 20px;}");
			done();
		}, {minify: true});
	});

});