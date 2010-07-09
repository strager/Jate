test({
    testFormat: function () {
        // This test is a bit heavy.
        var formatter = new Jate.Formatter(),
            translator = new Jate.Translator();

        var ft = new Jate.FormattingTranslator(formatter, translator),
            date = new Jate.UDate(2004, 2, 12, 15, 19, 21);

        formatter.addFormats({
            'default': new Jate.Formatters.Stringifier(),
            '~': new Jate.Formatters.Pluralizer(function (count) {
                return count === 1 ? 0 : 1;
            }),
            '@': new Jate.Formatters.DateFormatter('c', translator)
        });

        translator.addTranslation('L\'heure est {0@}.  J\'ai {1} pomme{1~|s}', 'Time: {0@}; {1} apple{1~|s}');

        this.assertEqual('Time: 2004-03-12T15:19:21+00:00; 42 apples', ft('L\'heure est {0@}.  J\'ai {1} pomme{1~|s}', date, 42));
    }
});
