test = new Test.Unit.Runner({
	testNoTranslate: function() {
		var translator = new Jate.Translator();

		this.assertEqual('foobar is cool', translator.translate('foobar is cool'));
		this.assertEqual('{0}, {1}', translator.translate('{0}, {1}'));
	},

	testConstructorMapping: function() {
		var translator = new Jate.Translator({
			'foobar is very cool': 'foobar est trés cool',
			'{0} {1}': '{1}, {0}'
		});

		this.assertEqual('foobar est trés cool', translator.translate('foobar is very cool'));
		this.assertEqual('{1}, {0}', translator.translate('{0} {1}'));
	},

	testAddTranslationToEmpty: function() {
		var translator = new Jate.Translator();

		translator.addTranslation('foobar is very cool', 'foobar est trés cool');

		this.assertEqual('foobar est trés cool', translator.translate('foobar is very cool'));
		this.assertEqual('{0}, {1}', translator.translate('{0}, {1}'));
	},

	testAddTranslationsToEmpty: function() {
		var translator = new Jate.Translator();

		translator.addTranslations({
			'foobar is very cool': 'foobar est trés cool',
			'{0} {1}': '{1}, {0}'
		});

		this.assertEqual('foobar est trés cool', translator.translate('foobar is very cool'));
		this.assertEqual('{1}, {0}', translator.translate('{0} {1}'));
	},

	testAddTranslationToExistingReplaces: function() {
		var translator = new Jate.Translator();

		translator.addTranslation('foobar is very cool', 'foobar n\'est pas cool');
		translator.addTranslation('foobar is very cool', 'foobar est trés cool');

		this.assertEqual('foobar est trés cool', translator.translate('foobar is very cool'));
		this.assertEqual('{0}, {1}', translator.translate('{0}, {1}'));
	},

	testAddTranslationsToExistingReplaces: function() {
		var translator = new Jate.Translator();

		translator.addTranslations({
			'foobar is very cool': 'foobar est si cool, n\'est-ce pas?',
			'{0} {1}': 'quoi {1}, {0}'
		});

		translator.addTranslations({
			'{0} {1}': '{1}, {0}',
			'foobar is very cool': 'foobar est trés cool'
		});

		this.assertEqual('foobar est trés cool', translator.translate('foobar is very cool'));
		this.assertEqual('{1}, {0}', translator.translate('{0} {1}'));
	},

	testAddContextualTranslationCoexistsWithExisting: function() {
		var translator = new Jate.Translator();

		translator.addTranslation('source', 'origin');
		translator.addTranslation('source', 'context', 'traduction');

		this.assertEqual('origin', translator.translate('source'));
		this.assertEqual('traduction', translator.translate('source', 'context'));
	},

	testAddContextualTranslationDoesNotAddNoContext: function() {
		var translator = new Jate.Translator();

		translator.addTranslation('source', 'context', 'traduction');

		this.assertEqual('source', translator.translate('source'));
	},

	testAddContextualTranslationWithNullCharThrows: function() {
		var translator = new Jate.Translator();

		this.assertRaise('Error', function() {
			translator.addTranslation('source', 'c\x000kies', 'traduction');
		});

		this.assertRaise('Error', function() {
			translator.addTranslation('s\x00urce', 'c00kies', 'traduction');
		});
	}
});

