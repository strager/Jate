Jate.Formatters = {
    Stringifier: function () {
        function format(value) {
            return value.toString ? value.toString() : value + '';
        }

        return format;
    },

    NumberFormatter: function () {
        function format(value, options) {
            var optionParts = (options || '').split('.');
            var num = parseFloat(value, 10);
            var ret;
            var fixedLength = -1;
            var minLeftLength = 0;
            var leftPadValue = ' ';

            if (optionParts.length === 2) {
                fixedLength = optionParts[1] ? parseInt(optionParts[1], 10) : NaN;
                fixedLength = isNaN(fixedLength) ? -1 : fixedLength;

                minLeftLength = optionParts[0] ? parseInt(optionParts[0], 10) : NaN;
                minLeftLength = isNaN(minLeftLength) ? 0 : minLeftLength;

                if (optionParts[0].length > 0 && optionParts[0][0] === '0') {
                    leftPadValue = '0';
                }
            }

            ret = fixedLength < 0 ? num.toString() : num.toFixed(optionParts[1]);

            while (ret.match(/^(.*(?=\.)|.*$)/)[0].length < minLeftLength) {
                ret = leftPadValue + ret;
            }

            return ret;
        }

        return format;
    },

    Pluralizer: function (indexerFunction) {
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
    },

    DateFormatter: function (defaultFormat, translator) {
        function format(value, options) {
            var dateFormat = options || defaultFormat;

            return value.format(dateFormat, translator);
        }

        return format;
    }
};
