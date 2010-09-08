(function() {
    var assert = require('assert');
    var Translator = require('../src/translator').Translator;

    exports.testNoTranslate = function () {
        var translator = Translator();

        assert.equal('foobar is cool', translator.translate('foobar is cool'));
        assert.equal('{0}; {1}', translator.translate('{0}; {1}'));
    };

    exports.testAddTranslationToEmpty = function () {
        var translator = Translator();

        translator.addTranslation('foobar is very cool', 'foobar est tr\u00E9s cool');

        assert.equal('foobar est tr\u00E9s cool', translator.translate('foobar is very cool'));
        assert.equal('{0}; {1}', translator.translate('{0}; {1}'));
    };

    exports.testAddTranslationsToEmpty = function () {
        var translator = Translator();

        translator.addTranslations({
            'foobar is very cool': 'foobar est tr\u00E9s cool',
            '{0} {1}': '{1}; {0}'
        });

        assert.equal('foobar est tr\u00E9s cool', translator.translate('foobar is very cool'));
        assert.equal('{1}; {0}', translator.translate('{0} {1}'));
    };

    exports.testAddTranslationToExistingReplaces = function () {
        var translator = Translator();

        translator.addTranslation('foobar is very cool', 'foobar n\'est pas cool');
        translator.addTranslation('foobar is very cool', 'foobar est tr\u00E9s cool');

        assert.equal('foobar est tr\u00E9s cool', translator.translate('foobar is very cool'));
        assert.equal('{0}; {1}', translator.translate('{0}; {1}'));
    };

    exports.testAddTranslationsToExistingReplaces = function () {
        var translator = Translator();

        translator.addTranslations({
            'foobar is very cool': 'foobar est si cool, n\'est-ce pas?',
            '{0} {1}': 'quoi {1}; {0}'
        });

        translator.addTranslations({
            '{0} {1}': '{1}; {0}',
            'foobar is very cool': 'foobar est tr\u00E9s cool'
        });

        assert.equal('foobar est tr\u00E9s cool', translator.translate('foobar is very cool'));
        assert.equal('{1}; {0}', translator.translate('{0} {1}'));
    };

    exports.testAddContextualTranslationCoexistsWithExisting = function () {
        var translator = Translator();

        translator.addTranslation('source', 'origin');
        translator.addTranslation('source', 'context', 'traduction');

        assert.equal('origin', translator.translate('source'));
        assert.equal('traduction', translator.translate('source', 'context'));
    };

    exports.testAddContextualTranslationDoesNotAddNoContext = function () {
        var translator = Translator();

        translator.addTranslation('source', 'context', 'traduction');

        assert.equal('source', translator.translate('source'));
    };

    exports.testAddContextualTranslationWithNullCharThrows = function () {
        var translator = Translator();

        assert.throws(function () {
            translator.addTranslation('source', 'c\x000kies', 'traduction');
        }, 'Error');

        assert.throws(function () {
            translator.addTranslation('s\x00urce', 'c00kies', 'traduction');
        }, 'Error');
    };

    if (require.main === module) {
        require('patr/runner').run(exports);
    }
})();
