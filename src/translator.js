Jate.Translator = function (/* translations ... */) {
    var sourcePrefix = '\x00\x00';
    var sourceContextDivider = '\x00';
    var translations = { };

    function getKeyFromSourceContext(source, context) {
        return sourcePrefix + source + (context ? sourceContextDivider + context : '');
    }

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

    this.addTranslations = function (translations) {
        var source, translation;

        for (source in translations) {
            if (translations.hasOwnProperty(source)) {
                translation = translations[source];

                this.addTranslation(source, translation);
            }
        }
    };

    var i;

    for (i = 0; i < arguments.length; ++i) {
        this.addTranslations(arguments[i]);
    }

    this.translate = function (text, context /* = undefined */) {
        var key = getKeyFromSourceContext(text, context);

        if (translations.hasOwnProperty(key)) {
            return translations[key];
        }

        return text;
    };
};
