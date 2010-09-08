(function () {
    var assert = require('assert');
    var Formatter = require('../src/formatter').Formatter;

    exports.testFormatRawStringReturnsSelf = function () {
        var formatter = Formatter();

        assert.equal('foo', formatter('foo'));
        assert.equal('{b0ar}x!@$!05', formatter('{b0ar}x!@$!05', '99999'));
    };

    exports.testFormatDefault = function () {
        var formatter = Formatter({
            'default': function (value) {
                return value.toString ? value.toString() : value + '';
            }
        });

        assert.equal('barx', formatter('ba{0}', 'rx'));
        assert.equal('This is a test', formatter('{0} {1} {2} {3}', 'This', 'is', 'a', 'test'));
        assert.equal('Hello, world', formatter('{2}, {1}', 'bad', 'world', 'Hello'));
    };

    exports.testFormatCustom = function () {
        var formatter = Formatter({
            '$': function (value) {
                return value.toFixed(2);
            },

            '|': function (value, options) {
                return options.split('|')[value];
            },

            '#': function (value) {
                return value.toString();
            }
        });

        assert.equal('over 9000.00', formatter('over {0$}', 9000));
        assert.equal('You have 2 cows; I have 1 cow', formatter('You have {0#} {0|cows|cow|cows}; I have {1#} {1|cows|cow|cows}', 2, 1));
    };

    exports.testFormatEscape = function () {
        var formatter = Formatter();

        assert.equal('foo{0bar}', formatter('foo\\{0bar}'));
    };

    exports.testNoPlaceholderFunctionThrows = function () {
        var formatter = Formatter();

        assert.throws(function () {
            formatter.formatPlaceholder('0', [ 'wootpoot' ]);
        }, 'Error');

        assert.throws(function () {
            formatter.formatPlaceholder('2', [ 0, '9', { 'x': 'y' } ]);
        }, 'Error');
    };

    exports.testBadPlaceholderFormatThrows = function () {
        var formatter = Formatter({
            'default': function () { }
        });

        assert.throws(function () {
            formatter.formatPlaceholder('x1');
        }, 'Error');

        assert.throws(function () {
            formatter.formatPlaceholder(' 5');
        }, 'Error');
    };

    exports.testOutOfRangePlaceholderThrows = function () {
        var formatter = Formatter({
            'default': function () { }
        });

        assert.throws(function () {
            formatter.formatPlaceholder('0', [ ]);
        }, 'Error');

        assert.throws(function () {
            formatter.formatPlaceholder('2', [ 'foo', 546 ]);
        }, 'Error');
    };

    exports.testDefaultPlaceholderCallsDefaultOnce = function () {
        var callCount = 0;

        var formatter = Formatter({
            'default': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0', [ 0 ]);

        assert.equal(1, callCount);
    };

    exports.testDefaultPlaceholderCallsDefaultWithValue = function () {
        var callValue;

        var formatter = Formatter({
            'default': function (value) {
                callValue = value;
            }
        });

        formatter.formatPlaceholder('0', [ 10 ]);

        assert.equal(10, callValue);
    };

    exports.testDefaultPlaceholderUsesReturnValue = function () {
        var formatter = Formatter({
            'default': function (value) {
                return 'bar';
            }
        });

        assert.equal('bar', formatter.formatPlaceholder('0', [ 0 ]));
    };

    exports.testCustomPlaceholderCallsDefault = function () {
        var callCustom;

        var formatter = Formatter({
            'default': function (value, custom) {
                callCustom = custom;
            }
        });

        formatter.formatPlaceholder('0fdf~w00t', [ 0 ]);

        assert.equal('fdf~w00t', callCustom);
    };

    exports.testCustomPlaceholderCallsCustomOnce = function () {
        var callCount = 0;

        var formatter = Formatter({
            '~': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0~', [ 0 ]);

        assert.equal(1, callCount);
    };

    exports.testExtendedCustomPlaceholderCallsCustomOnce = function () {
        var callCount = 0;

        var formatter = Formatter({
            '~': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0~@#$', [ 0 ]);

        assert.equal(1, callCount);
    };

    exports.testExtendedCustomPlaceholderCallsProperCustomOnce = function () {
        var callCount = 0;
        var badCallCount = 0;

        var formatter = Formatter({
            'default': function (value) {
                ++badCallCount;
            },

            '~': function (value) {
                ++badCallCount;
            },

            '~@': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0~@#$', [ 0 ]);

        assert.equal(1, callCount);
        assert.equal(0, badCallCount);
    };

    exports.testCustomPlaceholderCallsCustomWithValue = function () {
        var callValue;

        var formatter = Formatter({
            '~': function (value) {
                callValue = value;
            }
        });

        formatter.formatPlaceholder('0~', [ 10 ]);

        assert.equal(10, callValue);
    };

    exports.testCustomPlaceholderUsesCustomReturnValue = function () {
        var formatter = Formatter({
            '~': function (value) {
                return 'bar';
            }
        });

        assert.equal('bar', formatter.formatPlaceholder('0~', [ 0 ]));
    };

    if (require.main === module) {
        require('patr/runner').run(exports);
    }
}());
