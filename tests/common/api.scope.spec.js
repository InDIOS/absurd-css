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
			expect(css).toBe(".scoped.absurd-title{border-radius: 10px;}");
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
			expect(css).toBe(".scoped.absurd-title{border-radius: 10px;}");
			done();
		}, { minify: true });
	});

	it("should use scope with multiple selectors", function (done) {
		var A = Absurd();
		A.scope('#scope.scoped');
		A.add({
			'.absurd-title': {
				'border-radius': '10px'
			}
		});
		A.compile(function (err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("#scope.scoped.absurd-title{border-radius: 10px;}");
			done();
		}, { minify: true });
	});

	it("should use scope in every top selectors", function (done) {
		var A = Absurd();
		A.scope('#scope.scoped');
		A.add({
			'.absurd-title': {
				'border-radius': '10px',
				p: {
					color: '#865748'
				}
			},
			span: {
				mar: '4px auto'
			}
		});
		A.compile(function (err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("#scope.scoped.absurd-title{border-radius: 10px;}#scope.scoped.absurd-title p{color: #865748;}span#scope.scoped{margin: 4px auto;}");
			done();
		}, { minify: true });
	});

	it("should set scope depending of selector type", function (done) {
		var A = Absurd();
		A.scope('#scope.scoped');
		A.add({
			'.absurd-title': {
				'border-radius': '10px'
			},
			'.absurd .title': {
				'border-radius': '16px'
			},
			span: {
				mar: '4px auto'
			},
			'#span': {
				pad: '4px auto'
			},
			'span > a': {
				pad: '6px auto'
			},
			'ul > #item > .link': {
				pad: '8px auto'
			},
			'span + a': {
				fz: '14px'
			},
			'p ~ span': {
				fz: '18px'
			}
		});
		A.compile(function (err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("#scope.scoped.absurd-title{border-radius: 10px;}#scope.scoped.absurd .title{border-radius: 16px;}span#scope.scoped{margin: 4px auto;}#scope.scoped#span{padding: 4px auto;}span#scope.scoped > a#scope.scoped{padding: 6px auto;}ul#scope.scoped > #scope.scoped#item > #scope.scoped.link{padding: 8px auto;}span#scope.scoped + a#scope.scoped{font-size: 14px;}p#scope.scoped ~ span#scope.scoped{font-size: 18px;}");
			done();
		}, { minify: true });
	});

	it("should set scope to multiple selectors", function (done) {
		var A = Absurd();
		A.scope('#scope.scoped');
		A.add({
			'.absurd, .title': {
				'border-radius': '16px'
			},
			'.text, span > a': {
				pad: '4px auto'
			},
			'#text + span, a': {
				fz: '14px'
			},
			'.title, p ~ span': {
				fz: '18px'
			}
		});
		A.compile(function (err, css) {
			expect(err).toBe(null);
			expect(css).toBeDefined();
			expect(css).toBe("#scope.scoped.absurd,#scope.scoped.title{border-radius: 16px;}#scope.scoped.title,p#scope.scoped ~ span#scope.scoped{font-size: 18px;}#scope.scoped.text,span#scope.scoped > a#scope.scoped{padding: 4px auto;}#scope.scoped#text + span#scope.scoped,a#scope.scoped{font-size: 14px;}");
			done();
		}, { minify: true });
	});

});