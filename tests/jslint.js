(function () {
	function getScript(uri) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', uri, false);
		xhr.send(null);

		return xhr.responseText;
	}

	function logErrors(scriptName, errors) {
		var i, error, errorText;

		for (i = 0; i < errors.length; ++i) {
			error = errors[i];
			errorText = scriptName + ':' + error.line + ': ' + error.reason + '\n';
			logElement.appendChild(document.createTextNode(errorText));
		}
	}

	function makeScriptTester(uri) {
		return function () {
			var success = JSLINT(getScript(uri));

			if (!success) {
				logErrors(uri, JSLINT.errors);

				throw new Error('See JSLint logs');
			}
		};
	}

	var tests = { },
		scriptElements = document.body.getElementsByTagName('script'),
		count = scriptElements.length,
		i,
		scriptUri,
		testName,
		testFunc,
		logElement = document.getElementById('jslint_log');

	for (i = 0; i < count; ++i) {
		scriptUri = scriptElements[i].src;

		testName = 'test JSLint ' + scriptUri;
		testFunc = makeScriptTester(scriptUri);

		tests[testName] = testFunc;
	}

	window.test = new Test.Unit.Runner(tests);
})();
