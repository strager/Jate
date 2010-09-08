test('FormattingTranslator', {
    testFormat: function () {
        // This test is a bit heavy.
        var formatter = Jate.Formatter(),
            translator = Jate.Translator();

        var ft = Jate.FormattingTranslator(formatter, translator),
            date = Jate.UDate(2004, 2, 12, 15, 19, 21);

        formatter.addFormats({
            'default': Jate.Localizers.Stringifier(),
            '~': Jate.Localizers.Pluralizer(function (count) {
                return count === 1 ? 0 : 1;
            }),
            '@': Jate.Localizers.DateFormatter('c', translator)
        });

        translator.addTranslation('L\'heure est {0@}.  J\'ai {1} pomme{1~|s}', 'Time: {0@}; {1} apple{1~|s}');

        assertEquals('Time: 2004-03-12T15:19:21+00:00; 42 apples', ft('L\'heure est {0@}.  J\'ai {1} pomme{1~|s}', date, 42));
    }
});
