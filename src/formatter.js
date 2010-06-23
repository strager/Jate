function Formatter(placeholderFormatters) {
	this.placeholderFormatters = placeholderFormatters || { };

	this.format = function(text) {
		return text;
	};

	this.formatPlaceholder = function(placeholder, values) {
		values = values || [ ];

		var parts = placeholder.match(/^([0-9]+)(.*)$/);

		if(!parts) {
			return null;
			// FIXME Exception?
		}

		var index = parseInt(parts[1], 10);
		var value = index === NaN || index > values.length ? undefined : values[index];

		var rest = parts[2];
		var formatterName = this._getPlaceholderFormatterName(rest);
		var formatter = this.placeholderFormatters[formatterName || 'default'];

		var options = rest.substr(formatterName.length);

		if(!formatter) {
			return null;
			// FIXME Exception?
		}

		return formatter.call(this, value, options);
	};

	this._getPlaceholderFormatterName = function(rest) {
		var i, name;

		for(i = rest.length; i > 0; --i) {
			name = rest.substr(0, i);

			if(this.placeholderFormatters.hasOwnProperty(name)) {
				return name;
			}
		}

		return '';
	};
}
