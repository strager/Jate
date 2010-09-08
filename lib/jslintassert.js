// TODO Make work in browser too
(function () {
    function getJSLINT() {
        var jslintScript, jslintFileName = __dirname + '/jslint.js';
        var sandbox = { };

        if (!getJSLINT.JSLINT) {
            // FIXME probably not the best to assume UTF-8
            jslintScript = require('fs').readFileSync(jslintFileName, 'utf8');
            process.binding('evals').Script.runInNewContext(jslintScript, sandbox, jslintFileName);

            if (!sandbox.JSLINT) {
                throw new Error('Failed to load JSLINT');
            }

            getJSLINT.JSLINT = sandbox.JSLINT;
        }

        return getJSLINT.JSLINT;
    }

    function logErrors(errors, code, message) {
        var i, error, errorText = '';
        var prefix = message ? message + ':' : '';

        for (i = 0; i < errors.length; ++i) {
            error = errors[i];

            if (error) {
                errorText += prefix + error.line + ': ' + error.reason + '\n';
            }
        }

        require('sys').print(errorText);
    }

    function filterErrors(errors) {
        var i, error;
        var out = [ ];

        for (i = 0; i < errors.length; ++i) {
            error = errors[i];

            // TODO Send a feature request to disable this warning in JSLint
            if (
                error &&
                !/dangling '_'/.test(error.reason)    // Allow __dirname
            ) {
                out[out.length] = error;
            }
        }

        return out;
    }

    exports.lintString = function (code, options, message) {
        // Calls to JSLINT may modify the options object
        // so we clone it to make the caller happy
        var optionsCopy = { }, option;

        for (option in options) {
            if (options.hasOwnProperty(option)) {
                optionsCopy[option] = options[option];
            }
        }

        var JSLINT = getJSLINT();
        var isSuccess = JSLINT(code, optionsCopy);

        if (!isSuccess) {
            errors = filterErrors(JSLINT.errors);

            if (errors.length) {
                logErrors(errors, code, message);

                require('assert').ok(false, 'JSLINT; see above');
            }
        }
    };

    exports.lintFile = function (fileName, options) {
        // FIXME probably not the best to assume UTF-8
        var file = require('fs').readFileSync(fileName, 'utf8');

        exports.lintString(file, options, fileName);
    };

    exports.lintFileTest = function (fileName, options) {
        return function () {
            return exports.lintFile(fileName, options);
        };
    };
}());
