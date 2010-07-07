Jate.FormattingTranslator = function (formatter) {
    this.Pluralizer = function (indexerFunction) {
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

    this.DateFormatter = function (defaultFormat) {
        function format(value, options) {
            var dateFormat = options || defaultFormat;

            return value.format(dateFormat);
        }

        return format;
    };
};
