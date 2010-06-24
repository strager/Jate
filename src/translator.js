function Translator(/* translations ... */) {
	var translations = { };

	this.addTranslation = function(source, translation) {
		translations[source] = translation;
	};

	this.addTranslations = function(translations) {
		var source, translation;

		for(source in translations) {
			translation = translations[source];

			this.addTranslation(source, translation);
		}
	};

	var i;

	for(i = 0; i < arguments.length; ++i) {
		this.addTranslations(arguments[i]);
	}

	this.translate = function(text) {
		if(translations.hasOwnProperty(text)) {
			return translations[text];
		}

		return text;
	};
}
