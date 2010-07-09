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

    ft.Pluralizer = function (indexerFunction) {
        var optionsDivider = '|';

        function getIndex(count) {
            var index = indexerFunction.call(this, count);

            if (index < 0) {
                throw new Error('Index out of range');
            }

            if (Math.floor(index) !== index) {
                throw new Error('Index must be an integer');
            }

            return index;
        }

        function pluralize(count, parameters) {
            var index = getIndex(count);

            if (index < 0 || index >= parameters.length) {
                throw new Error('Index out of range');
            }

            if (Math.floor(index) !== index) {
                throw new Error('Index must be an integer');
            }

            return parameters[index];
        }

        function format(value, options) {
            var parts = options.split(optionsDivider);

            return pluralize(parseInt(value, 10), parts);
        }

        format.getIndex = getIndex;
        format.pluralize = pluralize;

        return format;
    };

    ft.DateFormatter = function (defaultFormat) {
        function format(value, options) {
            var dateFormat = options || defaultFormat;

            return value.format(dateFormat, ft);
        }

        return format;
    };

    return ft;
};
