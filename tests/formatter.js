test({
    testFormatRawStringReturnsSelf: function () {
        var formatter = new Jate.Formatter();

        this.assertEqual('foo', formatter('foo'));
        this.assertEqual('{b0ar}x!@$!05', formatter('{b0ar}x!@$!05', '99999'));
    },

    testFormatDefault: function () {
        var formatter = new Jate.Formatter({
            'default': function (value) {
                return value.toString ? value.toString() : value + '';
            }
        });

        this.assertEqual('barx', formatter('ba{0}', 'rx'));
        this.assertEqual('This is a test', formatter('{0} {1} {2} {3}', 'This', 'is', 'a', 'test'));
        this.assertEqual('Hello, world', formatter('{2}, {1}', 'bad', 'world', 'Hello'));
    },

    testFormatCustom: function () {
        var formatter = new Jate.Formatter({
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

        this.assertEqual('over 9000.00', formatter('over {0$}', 9000));
        this.assertEqual('You have 2 cows; I have 1 cow', formatter('You have {0#} {0|cows|cow|cows}; I have {1#} {1|cows|cow|cows}', 2, 1));
    },

    testFormatEscape: function () {
        var formatter = new Jate.Formatter();

        this.assertEqual('foo{0bar}', formatter('foo\\{0bar}'));
    },

    testNoPlaceholderFunctionThrows: function () {
        var formatter = new Jate.Formatter();

        this.assertRaise('Error', function () {
            formatter.formatPlaceholder('0', [ 'wootpoot' ]);
        });

        this.assertRaise('Error', function () {
            formatter.formatPlaceholder('2', [ 0, '9', { 'x': 'y' } ]);
        });
    },

    testBadPlaceholderFormatThrows: function () {
        var formatter = new Jate.Formatter({
            'default': function () { }
        });

        this.assertRaise('Error', function () {
            formatter.formatPlaceholder('x1');
        });

        this.assertRaise('Error', function () {
            formatter.formatPlaceholder(' 5');
        });
    },

    testOutOfRangePlaceholderThrows: function () {
        var formatter = new Jate.Formatter({
            'default': function () { }
        });

        this.assertRaise('Error', function () {
            formatter.formatPlaceholder('0', [ ]);
        });

        this.assertRaise('Error', function () {
            formatter.formatPlaceholder('2', [ 'foo', 546 ]);
        });
    },

    testDefaultPlaceholderCallsDefaultOnce: function () {
        var callCount = 0;

        var formatter = new Jate.Formatter({
            'default': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0', [ 0 ]);

        this.assertEqual(1, callCount);
    },

    testDefaultPlaceholderCallsDefaultWithValue: function () {
        var callValue;

        var formatter = new Jate.Formatter({
            'default': function (value) {
                callValue = value;
            }
        });

        formatter.formatPlaceholder('0', [ 10 ]);

        this.assertEqual(10, callValue);
    },

    testDefaultPlaceholderUsesReturnValue: function () {
        var formatter = new Jate.Formatter({
            'default': function (value) {
                return 'bar';
            }
        });

        this.assertEqual('bar', formatter.formatPlaceholder('0', [ 0 ]));
    },

    testCustomPlaceholderCallsDefault: function () {
        var callCustom;

        var formatter = new Jate.Formatter({
            'default': function (value, custom) {
                callCustom = custom;
            }
        });

        formatter.formatPlaceholder('0fdf~w00t', [ 0 ]);

        this.assertEqual('fdf~w00t', callCustom);
    },

    testCustomPlaceholderCallsCustomOnce: function () {
        var callCount = 0;

        var formatter = new Jate.Formatter({
            '~': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0~', [ 0 ]);

        this.assertEqual(1, callCount);
    },

    testExtendedCustomPlaceholderCallsCustomOnce: function () {
        var callCount = 0;

        var formatter = new Jate.Formatter({
            '~': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0~@#$', [ 0 ]);

        this.assertEqual(1, callCount);
    },

    testExtendedCustomPlaceholderCallsProperCustomOnce: function () {
        var callCount = 0;
        var badCallCount = 0;

        var formatter = new Jate.Formatter({
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

        this.assertEqual(1, callCount);
        this.assertEqual(0, badCallCount);
    },

    testCustomPlaceholderCallsCustomWithValue: function () {
        var callValue;

        var formatter = new Jate.Formatter({
            '~': function (value) {
                callValue = value;
            }
        });

        formatter.formatPlaceholder('0~', [ 10 ]);

        this.assertEqual(10, callValue);
    },

    testCustomPlaceholderUsesCustomReturnValue: function () {
        var formatter = new Jate.Formatter({
            '~': function (value) {
                return 'bar';
            }
        });

        this.assertEqual('bar', formatter.formatPlaceholder('0~', [ 0 ]));
    },

    testStringFormat: function () {
        this.assertEqual('fsdf$', Jate.Formatter.Formats.string('fsdf$'));
        this.assertEqual('5451', Jate.Formatter.Formats.string(5451));
        this.assertEqual('poo', Jate.Formatter.Formats.string({
            toString: function () {
                return 'poo';
            }
        }));
    },

    testNumberFormat: function () {
        this.assertEqual('54678', Jate.Formatter.Formats.number(54678));
        this.assertEqual('     54678', Jate.Formatter.Formats.number(54678, '10.'));
        this.assertEqual('0000054678', Jate.Formatter.Formats.number(54678, '010.'));
        this.assertEqual('54.678', Jate.Formatter.Formats.number(54.678));
        this.assertEqual('54.68', Jate.Formatter.Formats.number(54.678, '.2'));
        this.assertEqual('  54.68', Jate.Formatter.Formats.number(54.678, '4.2'));
        this.assertEqual('  54.678', Jate.Formatter.Formats.number(54.678, '4.'));
        this.assertEqual('0054.68', Jate.Formatter.Formats.number(54.678, '04.2'));
        this.assertEqual('0054.678', Jate.Formatter.Formats.number(54.678, '04.'));
    }
});
