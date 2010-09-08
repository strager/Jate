(function () {
    var assert = require('assert');
    var Translator = require('../src/translator').Translator;
    var Formatter = require('../src/formatter').Formatter;
    var FormattingTranslator = require('../src/formattingtranslator').FormattingTranslator;
    var UDate = require('../src/udate').UDate;
    var Localizers = require('../src/localizers');

    exports.testFormat = function () {
        // This test is a bit heavy.
        var formatter = Formatter(),
            translator = Translator();

        var ft = FormattingTranslator(formatter, translator),
            date = UDate(2004, 2, 12, 15, 19, 21);

        formatter.addFormats({
            'default': Localizers.Stringifier(),
            '~': Localizers.Pluralizer(function (count) {
                return count === 1 ? 0 : 1;
            }),
            '@': Localizers.DateFormatter('c', translator)
        });

        translator.addTranslation('L\'heure est {0@}.  J\'ai {1} pomme{1~|s}', 'Time: {0@}; {1} apple{1~|s}');

        assert.equal('Time: 2004-03-12T15:19:21+00:00; 42 apples', ft('L\'heure est {0@}.  J\'ai {1} pomme{1~|s}', date, 42));
    };

    if (require.main === module) {
        require('patr/runner').run(exports);
    }
}());
