function FormattingTranslator() {
}

FormattingTranslator.Pluralizer = function(indexerFunction) {
	this.getIndex = function(count) {
		var index = indexerFunction.call(this, count);

		if(index < 0) {
			throw new Error('Index out of range');
		}

		if(Math.floor(index) !== index) {
			throw new Error('Index must be an integer');
		}

		return index;
	};

	this.pluralize = function(count, parameters) {
		var index = this.getIndex(count);

		if(index < 0 || index >= parameters.length) {
			throw new Error('Index out of range');
		}

		if(Math.floor(index) !== index) {
			throw new Error('Index must be an integer');
		}

		return parameters[index];
	};
};
