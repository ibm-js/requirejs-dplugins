// run grunt --help for help on how to run
define([
	"./intern"
], function (intern) {
	intern.useSauceConnect = false;

	intern.environments = [{
		browserName: "firefox"
	}, {
		browserName: "chrome"
	}, {
		browserName: "internet explorer",
		requireWindowFocus: "true"
	}];

	intern.maxConcurrency = 1;

	return intern;
});
