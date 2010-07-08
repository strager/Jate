test({
    testPluralizerGetIndexCallsCallback: function () {
        var self = this;
        var callCount = 0;

        var ft = new Jate.FormattingTranslator(),
            p = new ft.Pluralizer(function (count) {
            ++callCount;

            self.assertEqual(42, count);

            return 69;
        });

        this.assertEqual(69, p.getIndex(42));
        this.assertEqual(1, callCount);
    },

    testPluralizerPluralize: function () {
        var ft = new Jate.FormattingTranslator(),
            p = new ft.Pluralizer(function (count) {
            return Math.abs(Math.floor(count));
        });

        this.assertEqual('two', p.pluralize(2, [ 'zero', 'one', 'two' ]));
        this.assertEqual('zero', p.pluralize(0, [ 'zero', 'one', 'two' ]));
        this.assertEqual('one', p.pluralize(-1, [ 'zero', 'one', 'two' ]));
        this.assertEqual('two', p.pluralize(2.999, [ 'zero', 'one', 'two' ]));
    },

    testPluralizerPluralizeOutOfRangeThrows: function () {
        var ft = new Jate.FormattingTranslator(),
            p = new ft.Pluralizer(function (count) {
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

        var ft = new Jate.FormattingTranslator(),
            p = new ft.Pluralizer(function (count) {
            return Math.abs(Math.floor(count));
        });

        this.assertEqual('two', p(2, 'zero|one|two'));
        this.assertEqual('zero', p(0, 'zero|one|two'));
        this.assertEqual('one', p(-1, 'zero|one|two'));
        this.assertEqual('two', p(2.999, 'zero|one|two'));
    },

    testDateFormatterDefault: function () {
        var ft = new Jate.FormattingTranslator(),
            d = new ft.DateFormatter('c'),
            date = new Jate.UDate(2004, 2, 12, 15, 19, 21);

        this.assertEqual('2004-03-12T15:19:21+00:00', d(date));
        this.assertEqual('2004-03-12T15:19:21+00:00', d(date, ''));
    },

    testDateFormatterCustom: function () {
        var ft = new Jate.FormattingTranslator(),
            d = new ft.DateFormatter(),
            date = new Jate.UDate(2004, 2, 12, 15, 19, 21);

        this.assertEqual('2004-03-12T15:19:21+00:00', d(date, 'c'));
    },

    testFormat: function () {
        // This test is a bit heavy.
        var formatter = new Jate.Formatter(),
            translator = new Jate.Translator();

        var ft = new Jate.FormattingTranslator(formatter, translator),
            date = new Jate.UDate(2004, 2, 12, 15, 19, 21);

        ft.installFormatters([
            new ft.Pluralizer(function (count) {
                return count === 1 ? 0 : 1;
            }),
            new ft.DateFormatter('c')
        ]);

        translator.addTranslation('L\'heure est {0@}.  J\'ai {1} pomme{1~|s}', 'Time: {0@}; {1} apple{1~|s}');

        this.assertEqual('Time: 2004-03-12T15:19:21+00:00; 42 apples', ft('L\'heure est {0@}.  J\'ai {1} pomme{1~|s}', date, 42));
    }
});
