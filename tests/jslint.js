(function () {
    var scripts = [
        './formatter.js',
        './formattingtranslator.js',
        './localizers.js',
        './translator.js',
        './udate.js',
        './jslint.js',
        './extensions.js',

        '../src/formatter.js',
        '../src/formattingtranslator.js',
        '../src/localizers.js',
        '../src/translator.js',
        '../src/udate.js',

        '../lib/jslintassert.js'
    ], options = {
        undef: false,   // TODO Enable
        nomen: true,
        eqeqeq: true,
        bitwise: true,
        newcap: false,
        immed: false,   // TODO Enable
        browser: false,
        white: true,
        predef: [
            'require',
            'exports',
            'process'
        ]
    };

    var i;

    var lintFileTest = require('../lib/jslintassert').lintFileTest;

    for (i = 0; i < scripts.length; ++i) {
        exports[scripts[i]] = lintFileTest(__dirname + '/' + scripts[i], options);
    }

    if (require.main === module) {
        require('patr/runner').run(exports);
    }
})();
