(function () {
	function getScript(name) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', name, false);
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

	var tests = { },
		scriptElements = document.body.getElementsByTagName('script'),
		count = scriptElements.length,
		i,
		testName,
		testFunc,
		logElement = document.getElementById('jslint_log');

	for (i = 0; i < count; ++i) {
		testName = 'test JSLint ' + scriptElements[i].src;

		testFunc = (function (scriptElement) {
			return function () {
				var scriptName = scriptElement.src,
					success = JSLINT(getScript(scriptName));

				if (!success) {
					logErrors(scriptName, JSLINT.errors);

					throw new Error('See JSLint logs');
				}
			};
		})(scriptElements[i]);

		tests[testName] = testFunc;
	}

	new Test.Unit.Runner(tests);
})();
