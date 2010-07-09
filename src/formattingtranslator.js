Jate.FormattingTranslator = function (formatter, translator) {
    function ft() {
        var args = [ ], i;

        for (i = 0; i < arguments.length; ++i) {
            args.push(arguments[i]);
        }

        args[0] = translator.translate(args[0]);

        return formatter.apply(formatter, args);
    }

    ft.formatter = formatter;
    ft.translator = translator;

    return ft;
};
