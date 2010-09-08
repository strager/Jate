(function () {
    var tests = [ 'formatter', 'formattingtranslator', 'localizers', 'translator', 'udate' ];
    var i;

    for (i = 0; i < tests.length; ++i) {
        exports[tests[i]] = require('./' + tests[i]);
    }

    if (require.main === module) {
        require('patr/runner').run(exports);
    }
})();
