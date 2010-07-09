/*
 * Class: Jate.FormattingTranslator
 * FormattingTranslator is a class which first translates
 * a given format, then formats it with the given parameters.
 * It is provided as a convenience for the common operation of
 * translating a format then formatting that format.
 *
 * Parameters:
 * formatter - The formatter to perform the format operation.
 * translator - The translator to perform the translation.
 *
 * Returns: New instance of a FormattingTranslator.
 * This new instance is callable and performs the translation/format
 * operation.
 *
 * Inner parameters:
 * format - Format to translate.
 * ... - Arguments to substitute while formatting.
 * 
 */
Jate.FormattingTranslator = function (formatter, translator) {
    function ft() {
        var args = [ ], i;

        for (i = 0; i < arguments.length; ++i) {
            args.push(arguments[i]);
        }

        args[0] = ft.translator.translate(args[0]);

        return formatter.apply(ft.formatter, args);
    }

    /*
     * Property: formatter
     * The formatter to use when formatting.
     */
    ft.formatter = formatter;

    /*
     * Property: translator
     * The translator to use when translating.
     */
    ft.translator = translator;

    return ft;
};
