(function() {
    var assert = require('assert');
    var Localizers = require('../src/localizers');
    var UDate = require('../src/udate').UDate;

    exports.testStringifier = function () {
        var f = Localizers.Stringifier();

        assert.equal('fsdf$', f('fsdf$'));
        assert.equal('5451', f(5451));
        assert.equal('poo', f({
            toString: function () {
                return 'poo';
            }
        }));
    },

    exports.testNumberFormatter = function () {
        var f = Localizers.NumberFormatter();

        assert.equal('54678', f(54678));
        assert.equal('     54678', f(54678, '10.'));
        assert.equal('0000054678', f(54678, '010.'));
        assert.equal('54.678', f(54.678));
        assert.equal('54.68', f(54.678, '.2'));
        assert.equal('  54.68', f(54.678, '4.2'));
        assert.equal('  54.678', f(54.678, '4.'));
        assert.equal('0054.68', f(54.678, '04.2'));
        assert.equal('0054.678', f(54.678, '04.'));
    },

    exports.testPluralizerGetIndexCallsCallback = function () {
        var expectedAsserts = 2, asserts = 0;

        var p = Localizers.Pluralizer(function (count) {
            assert.equal(42, count);
            ++asserts;

            return 69;
        });

        assert.equal(69, p.getIndex(42));
        ++asserts;

        assert.equal(expectedAsserts, asserts, 'expected asserts');
    },

    exports.testPluralizerPluralize = function () {
        var p = Localizers.Pluralizer(function (count) {
            return Math.abs(Math.floor(count));
        });

        assert.equal('two', p.pluralize(2, [ 'zero', 'one', 'two' ]));
        assert.equal('zero', p.pluralize(0, [ 'zero', 'one', 'two' ]));
        assert.equal('one', p.pluralize(-1, [ 'zero', 'one', 'two' ]));
        assert.equal('two', p.pluralize(2.999, [ 'zero', 'one', 'two' ]));
    },

    exports.testPluralizerPluralizeOutOfRangeThrows = function () {
        var p = Localizers.Pluralizer(function (count) {
            return count;
        });

        assert.throws(function () {
            p.pluralize(0, [ ]);
        }, 'Error');

        assert.throws(function () {
            p.pluralize(1, [ ]);
        }, 'Error');

        assert.throws(function () {
            p.pluralize(0.1, [ 'o' ]);
        }, 'Error');

        assert.throws(function () {
            p.pluralize(-1, [ 'o', 'x' ]);
        }, 'Error');
    },

    exports.testPluralizerFormatter = function () {
        var callCount = 0;

        var p = Localizers.Pluralizer(function (count) {
            return Math.abs(Math.floor(count));
        });

        assert.equal('two', p(2, 'zero|one|two'));
        assert.equal('zero', p(0, 'zero|one|two'));
        assert.equal('one', p(-1, 'zero|one|two'));
        assert.equal('two', p(2.999, 'zero|one|two'));
    },

    exports.testDateFormatterDefault = function () {
        var d = Localizers.DateFormatter('c'),
            date = UDate(2004, 2, 12, 15, 19, 21);

        assert.equal('2004-03-12T15:19:21+00:00', d(date));
        assert.equal('2004-03-12T15:19:21+00:00', d(date, ''));
    },

    exports.testDateFormatterCustom = function () {
        var d = Localizers.DateFormatter(),
            date = UDate(2004, 2, 12, 15, 19, 21);

        assert.equal('2004-03-12T15:19:21+00:00', d(date, 'c'));
    }

    if (require.main === module) {
        require('patr/runner').run(exports);
    }
})();
