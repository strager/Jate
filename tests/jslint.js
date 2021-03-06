(function (testOptions) {
    var tests = { },
        scriptElements = document.getElementsByTagName('script'),
        count = scriptElements.length,
        i,
        scriptUri,
        testName,
        testFunc,
        logElement = document.getElementById('jslint_log');

    function getScript(uri) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', uri, false);
        xhr.send(null);

        return xhr.responseText;
    }

    function logErrors(scriptName, errors) {
        var i, error, errorText = '';

        for (i = 0; i < errors.length; ++i) {
            error = errors[i];
            errorText += scriptName + ':' + error.line + ': ' + error.reason + '\n';
        }

        fail('\n' + errorText);
    }

    function makeScriptTester(uri) {
        // Other calls to JSLINT may modify the options object
        var testOptionsCopy = { }, option;

        for (option in testOptions) {
            if (testOptions.hasOwnProperty(option)) {
                testOptionsCopy[option] = testOptions[option];
            }
        }

        return function () {
            var success = JSLINT(getScript(uri), testOptionsCopy);

            if (!success) {
                logErrors(uri, JSLINT.errors);

                throw new Error('See JSLint logs');
            }
        };
    }

    for (i = 0; i < count; ++i) {
        scriptUri = scriptElements[i].getAttribute('src');

        if (!scriptUri || !scriptUri.match(/^\/test\//)) {
            continue;
        }

        testName = 'test JSLint ' + scriptUri;
        testFunc = makeScriptTester(scriptUri);

        tests[testName] = testFunc;
    }

    test('JSLint', tests);
}({
    undef: true,
    nomen: true,
    eqeqeq: true,
    bitwise: true,
    newcap: true,
    immed: true,
    browser: true,
    white: true,
    predef: [
        'test',
        'Jate',
        'window',
        'JSLINT',

        'fail',
        'expectAsserts',
        'assertEquals',
        'assertThrows',
        'assertHasFieldsSet'
    ]
}));
