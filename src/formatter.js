function Formatter(placeholderFormatters) {
	this.format = function(text) {
		return text;
	};

	this.formatPlaceholder = function(placeholder, values) {
		values = values || [ ];

		var index = getPlaceholderIndex(placeholder);
		var value = typeof index === 'undefined' || index > values.length ? undefined : values[index];

		return placeholderFormatters['default'].call(this, value);
	};

	function getPlaceholderIndex(placeholder) {
		var num = parseInt(placeholder, 10);

		if(num === NaN) {
			return undefined;
		}

		return num;
	}
}
