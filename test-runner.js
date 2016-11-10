var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');

var jrunner = new Jasmine();
jrunner.configureDefaultReporter({print: false}); 
jrunner.env.clearReporters();                    
jrunner.addReporter(new SpecReporter());         
jrunner.loadConfig({
	spec_files: [
		'tests/**/*[sS]pec.js'
	],
	stopSpecOnExpectationFailure: false,
	random: false
});                        
jrunner.execute();