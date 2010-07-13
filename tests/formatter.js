test('Formatter', {
    testFormatRawStringReturnsSelf: function () {
        var formatter = new Jate.Formatter();

        assertEquals('foo', formatter('foo'));
        assertEquals('{b0ar}x!@$!05', formatter('{b0ar}x!@$!05', '99999'));
    },

    testFormatDefault: function () {
        var formatter = new Jate.Formatter({
            'default': function (value) {
                return value.toString ? value.toString() : value + '';
            }
        });

        assertEquals('barx', formatter('ba{0}', 'rx'));
        assertEquals('This is a test', formatter('{0} {1} {2} {3}', 'This', 'is', 'a', 'test'));
        assertEquals('Hello, world', formatter('{2}, {1}', 'bad', 'world', 'Hello'));
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

        assertEquals('over 9000.00', formatter('over {0$}', 9000));
        assertEquals('You have 2 cows; I have 1 cow', formatter('You have {0#} {0|cows|cow|cows}; I have {1#} {1|cows|cow|cows}', 2, 1));
    },

    testFormatEscape: function () {
        var formatter = new Jate.Formatter();

        assertEquals('foo{0bar}', formatter('foo\\{0bar}'));
    },

    testNoPlaceholderFunctionThrows: function () {
        var formatter = new Jate.Formatter();

        assertThrows('Error', function () {
            formatter.formatPlaceholder('0', [ 'wootpoot' ]);
        });

        assertThrows('Error', function () {
            formatter.formatPlaceholder('2', [ 0, '9', { 'x': 'y' } ]);
        });
    },

    testBadPlaceholderFormatThrows: function () {
        var formatter = new Jate.Formatter({
            'default': function () { }
        });

        assertThrows('Error', function () {
            formatter.formatPlaceholder('x1');
        });

        assertThrows('Error', function () {
            formatter.formatPlaceholder(' 5');
        });
    },

    testOutOfRangePlaceholderThrows: function () {
        var formatter = new Jate.Formatter({
            'default': function () { }
        });

        assertThrows('Error', function () {
            formatter.formatPlaceholder('0', [ ]);
        });

        assertThrows('Error', function () {
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

        assertEquals(1, callCount);
    },

    testDefaultPlaceholderCallsDefaultWithValue: function () {
        var callValue;

        var formatter = new Jate.Formatter({
            'default': function (value) {
                callValue = value;
            }
        });

        formatter.formatPlaceholder('0', [ 10 ]);

        assertEquals(10, callValue);
    },

    testDefaultPlaceholderUsesReturnValue: function () {
        var formatter = new Jate.Formatter({
            'default': function (value) {
                return 'bar';
            }
        });

        assertEquals('bar', formatter.formatPlaceholder('0', [ 0 ]));
    },

    testCustomPlaceholderCallsDefault: function () {
        var callCustom;

        var formatter = new Jate.Formatter({
            'default': function (value, custom) {
                callCustom = custom;
            }
        });

        formatter.formatPlaceholder('0fdf~w00t', [ 0 ]);

        assertEquals('fdf~w00t', callCustom);
    },

    testCustomPlaceholderCallsCustomOnce: function () {
        var callCount = 0;

        var formatter = new Jate.Formatter({
            '~': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0~', [ 0 ]);

        assertEquals(1, callCount);
    },

    testExtendedCustomPlaceholderCallsCustomOnce: function () {
        var callCount = 0;

        var formatter = new Jate.Formatter({
            '~': function (value) {
                ++callCount;
            }
        });

        formatter.formatPlaceholder('0~@#$', [ 0 ]);

        assertEquals(1, callCount);
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

        assertEquals(1, callCount);
        assertEquals(0, badCallCount);
    },

    testCustomPlaceholderCallsCustomWithValue: function () {
        var callValue;

        var formatter = new Jate.Formatter({
            '~': function (value) {
                callValue = value;
            }
        });

        formatter.formatPlaceholder('0~', [ 10 ]);

        assertEquals(10, callValue);
    },

    testCustomPlaceholderUsesCustomReturnValue: function () {
        var formatter = new Jate.Formatter({
            '~': function (value) {
                return 'bar';
            }
        });

        assertEquals('bar', formatter.formatPlaceholder('0~', [ 0 ]));
    }
});
