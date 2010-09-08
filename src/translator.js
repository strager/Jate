/*
 * Class: Jate.Translator
 * Translator is a class which allows translation based upon
 * a look-up table.
 *
 * Parameters:
 * None
 *
 * Returns:
 * New instance of a Translator.
 *
 * Example:
 * First, create a Translator instance.
 *
 * > var translator = new Jate.Translator();
 *
 * Then, load translations.
 *
 * > translator.addTranslation('Yes', 'Oui');
 * > translator.addTranslation('No', 'Non');
 *
 * Finally, translate at will.
 *
 * > translator.translate('Yes'); // 'Oui'
 *
 * Use contexts when loading translations to give translations namespaces.
 *
 * > translator.addTranslation('Exit', 'Program exit', 'Quitter');
 * > translator.addTranslation('Exit', 'Exit door', 'Sortie');
 * > translator.translate('Exit', 'Program exit'); // 'Quitter'
 * > translator.translate('Exit', 'Exit door'); // 'Sortie'
 */
exports.Translator = function () {
    if (!(this instanceof exports.Translator)) {
        return new exports.Translator();
    }

    var sourcePrefix = '\x00\x00';
    var sourceContextDivider = '\x00';
    var translations = { };

    function getKeyFromSourceContext(source, context) {
        return sourcePrefix + source + (context ? sourceContextDivider + context : '');
    }

    /*
     * Method: addTranslation
     * Adds a translation to the look-up table.
     *
     * Parameters:
     * source - The source text which will be translated.
     * context - Optional.  The context of the source text.
     * translation - The resulting translation of the source text.
     */
    this.addTranslation = function (source, /* [context], */ translation) {
        var context, key;

        if (arguments.length > 2) {
            context = arguments[1];
            translation = arguments[2];
        }

        if (source.indexOf(sourceContextDivider) >= 0 || (context || '').indexOf(sourceContextDivider) >= 0) {
            throw new Error('Translation source may not contain sourceContextDivider');
        }

        key = getKeyFromSourceContext(source, context);

        translations[key] = translation;
    };

    /*
     * Method: addTranslations
     * Adds a set of translations to the look-up table.
     *
     * Parameters:
     * translations - Source/translation pairs.
     */
    this.addTranslations = function (translations) {
        var source, translation;

        for (source in translations) {
            if (translations.hasOwnProperty(source)) {
                translation = translations[source];

                this.addTranslation(source, translation);
            }
        }
    };

    /*
     * Method: translate
     * Translates the given source text.
     *
     * Parameters:
     * text - The source to translate.
     * context - Optional.  The context of the source to translate.
     *
     * Returns:
     * The translated text, or the original text if there was no translation.
     */
    this.translate = function (text, context /* = undefined */) {
        var key = getKeyFromSourceContext(text, context);

        if (translations.hasOwnProperty(key)) {
            return translations[key];
        }

        return text;
    };
};
