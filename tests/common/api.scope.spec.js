describe("API(scope)", function () {

	var Absurd = require('../../index.js');

	it("should use scope", function (done) {
		Absurd(function (A) {
			A.scope('.scoped');
			A.add({
				'.absurd-title': {
					'border-radius': '10px'
				}
			});
		}).compile(function (err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toContain(".scoped");
			expect(css).toContain(".absurd-title");
			expect(css).toContain("border-radius: 10px");
			done();
		});
	});

	it("should use scope an apply it properly", function (done) {
		Absurd(function (A) {
			A.scope('.scoped');
			A.add({
				'.absurd-title': {
					'border-radius': '10px'
				}
			});
		}).compile(function (err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe(".scoped .absurd-title{border-radius: 10px;}");
			done();
		}, { minify: true });
	});

	it("should use scope in instances", function (done) {
		var A = Absurd();
		A.scope('.scoped');
		A.add({
			'.absurd-title': {
				'border-radius': '10px'
			}
		});
		A.compile(function (err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe(".scoped .absurd-title{border-radius: 10px;}");
			done();
		}, { minify: true });
	});

	it("should use scope with multiple selectors", function (done) {
		var A = Absurd();
		A.scope('.scoped #scope');
		A.add({
			'.absurd-title': {
				'border-radius': '10px'
			}
		});
		A.compile(function (err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe(".scoped #scope .absurd-title{border-radius: 10px;}");
			done();
		}, { minify: true });
	});

});