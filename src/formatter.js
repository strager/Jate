/*
 * Class: Formatter
 * Formatter allows strings to be formatted by replacing
 * placeholders in the format string with passed arguments.
 *
 * Example:
 * > var format = Formatter();
 * > format('{0}, {1}!', 'Hello', 'world'); // returns 'Hello, world!'
 * > format.addFormat('x', function (value, options) {
 * >     return 'Got ' + value + ' with ' + options;
 * > });
 * > format('{0xoptions here}', 42); // returns 'Got 42 with options here'
 * > 
 * > Property: formats
 * > Key-value pair of aliases to format functions.
 */

/*
 * Constructor: Constructor
 * Creates a new Formatter.
 *
 * Parameters:
 * ... - Format objects added with addFormats.
 */
exports.Formatter = function (/* formats... */) {
    var i;

    function format(text) {
        var values = [ ], i;

        for (i = 1; i < arguments.length; ++i) {
            values.push(arguments[i]);
        }

        var replacement = function (match, wrapper, placeholder1, prefix, placeholder2Wrapper, placeholder2) {
            if (prefix === '\\') {
                return placeholder2Wrapper;
            }

            var placeholder = placeholder1 || placeholder2;

            return (prefix || '') + format.formatPlaceholder(placeholder, values);
        };

        /* I wish JS had lookbehinds. */
        var reString = '\\{([0-9]+[^}]*)\\}';

        var re = new RegExp('(^' + reString + '|(.)(' + reString + '))', 'g');

        return text.replace(re, replacement);
    }

    function getPlaceholderFormatterName(rest) {
        var i, name;

        for (i = rest.length; i > 0; --i) {
            name = rest.substr(0, i);

            if (format.formats.hasOwnProperty(name)) {
                return name;
            }
        }

        return '';
    }

    function formatPlaceholder(placeholder, values) {
        values = values || [ ];

        var parts = placeholder.match(/^([0-9]+)(.*)$/);

        if (!parts) {
            throw new Error('Bad placeholder format');
        }

        var index = parseInt(parts[1], 10);

        if (isNaN(index)) {
            throw new Error('Bad index specified');
        }

        if (index < 0 || index >= values.length) {
            throw new Error('Placeholder out of range');
        }

        var value = values[index];

        var rest = parts[2];
        var formatterName = getPlaceholderFormatterName(rest);
        var formatter = format.formats[formatterName || 'default'];

        var options = rest.substr(formatterName.length);

        if (!formatter) {
            throw new Error('No valid formatter');
        }

        return formatter(value, options);
    }

    /*
     * Method: addFormat
     * Adds the given format to the format cache.
     *
     * Parameters:
     * alias - Placeholder alias which calls the format function.
     * formatFunc - The format function to call.
     */
    function addFormat(alias, formatFunc) {
        format.formats[alias] = formatFunc;
    }

    /* Method: addFormats
     * Adds the given collection of formats.
     *
     * Parameters:
     * formats - Key-value pairs of aliases to format functions.
     */
    function addFormats(formats) {
        var alias, formatFunc;

        for (alias in formats) {
            if (formats.hasOwnProperty(alias)) {
                formatFunc = formats[alias];
                addFormat(alias, formatFunc);
            }
        }
    }

    format.formatPlaceholder = formatPlaceholder;
    format.addFormat = addFormat;
    format.addFormats = addFormats;
    format.formats = { };

    for (i = 0; i < arguments.length; ++i) {
        addFormats(arguments[i]);
    }

    return format;
};
