new Test.Unit.Runner({
	testPluralizerGetIndexCallsCallback: function() {
		var self = this;
		var callCount = 0;

		var p = new FormattingTranslator.Pluralizer(function(count) {
			++callCount;

			self.assertEqual(42, count);

			return 69;
		});

		this.assertEqual(69, p.getIndex(42));

		this.assertEqual(1, callCount);
	},

	testPluralizerPluralize: function() {
		var p = new FormattingTranslator.Pluralizer(function(count) {
			return Math.abs(Math.floor(count));
		});

		this.assertEqual('two', p.pluralize(2, [ 'zero', 'one', 'two' ]));
		this.assertEqual('zero', p.pluralize(0, [ 'zero', 'one', 'two' ]));
		this.assertEqual('one', p.pluralize(-1, [ 'zero', 'one', 'two' ]));
		this.assertEqual('two', p.pluralize(2.999, [ 'zero', 'one', 'two' ]));
	},

	testPluralizerPluralizeOutOfRangeThrows: function() {
		var p = new FormattingTranslator.Pluralizer(function(count) {
			return count;
		});

		this.assertRaise('Error', function() {
			p.pluralize(0, [ ]);
		});

		this.assertRaise('Error', function() {
			p.pluralize(1, [ ]);
		});

		this.assertRaise('Error', function() {
			p.pluralize(0.1, [ 'o' ]);
		});

		this.assertRaise('Error', function() {
			p.pluralize(-1, [ 'o', 'x' ]);
		});
	},

	testPluralizerFormatter: function() {
		var callCount = 0;

		var p = new FormattingTranslator.Pluralizer(function(count) {
			return Math.abs(Math.floor(count));
		});

		var f = p.formatter;

		this.assertEqual('two', f(2, 'zero|one|two'));
		this.assertEqual('zero', f(0, 'zero|one|two'));
		this.assertEqual('one', f(-1, 'zero|one|two'));
		this.assertEqual('two', f(2.999, 'zero|one|two'));
	}
});
