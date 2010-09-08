test('Localizers', {
    testStringifier: function () {
        var f = new Jate.Localizers.Stringifier();

        assertEquals('fsdf$', f('fsdf$'));
        assertEquals('5451', f(5451));
        assertEquals('poo', f({
            toString: function () {
                return 'poo';
            }
        }));
    },

    testNumberFormatter: function () {
        var f = new Jate.Localizers.NumberFormatter();

        assertEquals('54678', f(54678));
        assertEquals('     54678', f(54678, '10.'));
        assertEquals('0000054678', f(54678, '010.'));
        assertEquals('54.678', f(54.678));
        assertEquals('54.68', f(54.678, '.2'));
        assertEquals('  54.68', f(54.678, '4.2'));
        assertEquals('  54.678', f(54.678, '4.'));
        assertEquals('0054.68', f(54.678, '04.2'));
        assertEquals('0054.678', f(54.678, '04.'));
    },

    testPluralizerGetIndexCallsCallback: function () {
        expectAsserts(2);

        var p = new Jate.Localizers.Pluralizer(function (count) {
            assertEquals(42, count);

            return 69;
        });

        assertEquals(69, p.getIndex(42));
    },

    testPluralizerPluralize: function () {
        var p = new Jate.Localizers.Pluralizer(function (count) {
            return Math.abs(Math.floor(count));
        });

        assertEquals('two', p.pluralize(2, [ 'zero', 'one', 'two' ]));
        assertEquals('zero', p.pluralize(0, [ 'zero', 'one', 'two' ]));
        assertEquals('one', p.pluralize(-1, [ 'zero', 'one', 'two' ]));
        assertEquals('two', p.pluralize(2.999, [ 'zero', 'one', 'two' ]));
    },

    testPluralizerPluralizeOutOfRangeThrows: function () {
        var p = new Jate.Localizers.Pluralizer(function (count) {
            return count;
        });

        assertThrows('Error', function () {
            p.pluralize(0, [ ]);
        });

        assertThrows('Error', function () {
            p.pluralize(1, [ ]);
        });

        assertThrows('Error', function () {
            p.pluralize(0.1, [ 'o' ]);
        });

        assertThrows('Error', function () {
            p.pluralize(-1, [ 'o', 'x' ]);
        });
    },

    testPluralizerFormatter: function () {
        var callCount = 0;

        var p = new Jate.Localizers.Pluralizer(function (count) {
            return Math.abs(Math.floor(count));
        });

        assertEquals('two', p(2, 'zero|one|two'));
        assertEquals('zero', p(0, 'zero|one|two'));
        assertEquals('one', p(-1, 'zero|one|two'));
        assertEquals('two', p(2.999, 'zero|one|two'));
    },

    testDateFormatterDefault: function () {
        var d = new Jate.Localizers.DateFormatter('c'),
            date = new Jate.UDate(2004, 2, 12, 15, 19, 21);

        assertEquals('2004-03-12T15:19:21+00:00', d(date));
        assertEquals('2004-03-12T15:19:21+00:00', d(date, ''));
    },

    testDateFormatterCustom: function () {
        var d = new Jate.Localizers.DateFormatter(),
            date = new Jate.UDate(2004, 2, 12, 15, 19, 21);

        assertEquals('2004-03-12T15:19:21+00:00', d(date, 'c'));
    }
});
