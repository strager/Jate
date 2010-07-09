test({
    testStringifier: function () {
        var f = new Jate.Formatters.Stringifier();

        this.assertEqual('fsdf$', f('fsdf$'));
        this.assertEqual('5451', f(5451));
        this.assertEqual('poo', f({
            toString: function () {
                return 'poo';
            }
        }));
    },

    testNumberFormatter: function () {
        var f = new Jate.Formatters.NumberFormatter();

        this.assertEqual('54678', f(54678));
        this.assertEqual('     54678', f(54678, '10.'));
        this.assertEqual('0000054678', f(54678, '010.'));
        this.assertEqual('54.678', f(54.678));
        this.assertEqual('54.68', f(54.678, '.2'));
        this.assertEqual('  54.68', f(54.678, '4.2'));
        this.assertEqual('  54.678', f(54.678, '4.'));
        this.assertEqual('0054.68', f(54.678, '04.2'));
        this.assertEqual('0054.678', f(54.678, '04.'));
    },

    testPluralizerGetIndexCallsCallback: function () {
        var self = this;
        var callCount = 0;

        var p = new Jate.Formatters.Pluralizer(function (count) {
            ++callCount;

            self.assertEqual(42, count);

            return 69;
        });

        this.assertEqual(69, p.getIndex(42));
        this.assertEqual(1, callCount);
    },

    testPluralizerPluralize: function () {
        var p = new Jate.Formatters.Pluralizer(function (count) {
            return Math.abs(Math.floor(count));
        });

        this.assertEqual('two', p.pluralize(2, [ 'zero', 'one', 'two' ]));
        this.assertEqual('zero', p.pluralize(0, [ 'zero', 'one', 'two' ]));
        this.assertEqual('one', p.pluralize(-1, [ 'zero', 'one', 'two' ]));
        this.assertEqual('two', p.pluralize(2.999, [ 'zero', 'one', 'two' ]));
    },

    testPluralizerPluralizeOutOfRangeThrows: function () {
        var p = new Jate.Formatters.Pluralizer(function (count) {
            return count;
        });

        this.assertRaise('Error', function () {
            p.pluralize(0, [ ]);
        });

        this.assertRaise('Error', function () {
            p.pluralize(1, [ ]);
        });

        this.assertRaise('Error', function () {
            p.pluralize(0.1, [ 'o' ]);
        });

        this.assertRaise('Error', function () {
            p.pluralize(-1, [ 'o', 'x' ]);
        });
    },

    testPluralizerFormatter: function () {
        var callCount = 0;

        var p = new Jate.Formatters.Pluralizer(function (count) {
            return Math.abs(Math.floor(count));
        });

        this.assertEqual('two', p(2, 'zero|one|two'));
        this.assertEqual('zero', p(0, 'zero|one|two'));
        this.assertEqual('one', p(-1, 'zero|one|two'));
        this.assertEqual('two', p(2.999, 'zero|one|two'));
    },

    testDateFormatterDefault: function () {
        var d = new Jate.Formatters.DateFormatter('c'),
            date = new Jate.UDate(2004, 2, 12, 15, 19, 21);

        this.assertEqual('2004-03-12T15:19:21+00:00', d(date));
        this.assertEqual('2004-03-12T15:19:21+00:00', d(date, ''));
    },

    testDateFormatterCustom: function () {
        var d = new Jate.Formatters.DateFormatter(),
            date = new Jate.UDate(2004, 2, 12, 15, 19, 21);

        this.assertEqual('2004-03-12T15:19:21+00:00', d(date, 'c'));
    }
});
