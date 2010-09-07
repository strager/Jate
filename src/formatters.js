/*
 * Namespace: Jate.Formatters
 */
Jate.Formatters = {
    /*
     * Constructor: Stringifier
     * Converts the value into a string.
     */
    Stringifier: function () {
        function format(value) {
            return value.toString ? value.toString() : value + '';
        }

        return format;
    },

    /*
     * Constructor: NumberFormatter
     * Formats the value as a number.
     *
     * Optionally, you may include arguments
     * when formatting:
     *
     * > 0###.###
     * > | | |  \__ Number of digits to show after the decimal
     * > | | |      place.  If empty, use as many as needed.
     * > | | |
     * > | |  \___ Decimal placeholder
     * > | |
     * > |  \_____ Number of characters to show before the decimal
     * > |         place.  Will pad with sspaces.  If empty, use
     * > |         as many as needed, but no more
     * > |
     * >  \_______ If present, use '0' instead of a space for the
     * >           pad character.
     */
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

    /*
     * Constructor: Pluralizer
     * Picks a string from an array given an indexer.
     *
     * A Pluralizer first transforms the value using an
     * indexer function into a plurality index.  This
     * plurality index is used to chose which of the
     * options to the format to chose.  Options are split
     * by the pipe character ('|') and are indexed from
     * 0, like JavaScript arrays.
     *
     * For example, an indexer for the English language
     * may look like:
     *
     * > function (value) {
     * >     return value === 1 ? 0 : 1;
     * > }
     *
     * and a corresponding option may look
     * like:
     * > knife|knives
     *
     * This allows a formatter to write the following
     * format to pluralize a word:
     *
     * > There are {0} {0|knife|knives} in the drawer.
     *
     * Parameters:
     * indexerFunction(value) - Callback which returns the
     *                          option index to reference.
     */
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

    /*
     * Constructor: DateFormatter
     * Formats a given UDate.
     *
     * Parameters:
     * defaultFormat - The date format to use if none is
     *                 specified in the format itself.
     * translator - Translation function to use for
     *              translatable parts of the returned
     *              format.  See: Jate.UDate.format.
     */
    DateFormatter: function (defaultFormat, translator) {
        function format(value, options) {
            var dateFormat = options || defaultFormat;

            return value.format(dateFormat, translator);
        }

        return format;
    }
};
