new Test.Unit.Runner({
	testRawStringReturnsSelf: function() {
		var formatter = new Formatter();

		this.assertEqual('foo', formatter.format('foo'));
		this.assertEqual('{b0ar}x!@$!05', formatter.format('{b0ar}x!@$!05'));
	},

	testDefaultPlaceholderCallsCustomOnce: function() {
		var callCount = 0;

		var formatter = new Formatter({
			'default': function(value) {
				++callCount;
			}
		});

		formatter.formatPlaceholder('0');

		this.assertEqual(1, callCount);
	},

	testDefaultPlaceholderCallsCustomWithValue: function() {
		var callValue = undefined;

		var formatter = new Formatter({
			'default': function(value) {
				callValue = value;
			}
		});

		formatter.formatPlaceholder('0', [ 10 ]);

		this.assertEqual(10, callValue);
	},

	testDefaultPlaceholderUsesCustomReturnValue: function() {
		var formatter = new Formatter({
			'default': function(value) {
				return 'bar';
			}
		});

		this.assertEqual('bar', formatter.formatPlaceholder('0'));
	}
});
