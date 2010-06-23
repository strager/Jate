new Test.Unit.Runner({
	testFormatRawStringReturnsSelf: function() {
		var formatter = new Formatter();

		this.assertEqual('foo', formatter.format('foo'));
		this.assertEqual('{b0ar}x!@$!05', formatter.format('{b0ar}x!@$!05'));
	},

	testNoPlaceholderFunctionReturnsNull: function() {
		var formatter = new Formatter();

		this.assertEqual(null, formatter.formatPlaceholder('0', [ 'wootpoot' ]));
		this.assertEqual(null, formatter.formatPlaceholder('2', [ 0, '9', { 'x': 'y' } ]));
	},

	testDefaultPlaceholderCallsDefaultOnce: function() {
		var callCount = 0;

		var formatter = new Formatter({
			'default': function(value) {
				++callCount;
			}
		});

		formatter.formatPlaceholder('0');

		this.assertEqual(1, callCount);
	},

	testDefaultPlaceholderCallsDefaultWithValue: function() {
		var callValue = undefined;

		var formatter = new Formatter({
			'default': function(value) {
				callValue = value;
			}
		});

		formatter.formatPlaceholder('0', [ 10 ]);

		this.assertEqual(10, callValue);
	},

	testDefaultPlaceholderUsesReturnValue: function() {
		var formatter = new Formatter({
			'default': function(value) {
				return 'bar';
			}
		});

		this.assertEqual('bar', formatter.formatPlaceholder('0'));
	},

	testCustomPlaceholderCallsDefault: function() {
		var callCustom = undefined;

		var formatter = new Formatter({
			'default': function(value, custom) {
				callCustom = custom;
			}
		});

		formatter.formatPlaceholder('0fdf~w00t');

		this.assertEqual('fdf~w00t', callCustom);
	},

	testCustomPlaceholderCallsCustomOnce: function() {
		var callCount = 0;

		var formatter = new Formatter({
			'~': function(value) {
				++callCount;
			}
		});

		formatter.formatPlaceholder('0~');

		this.assertEqual(1, callCount);
	},

	testExtendedCustomPlaceholderCallsCustomOnce: function() {
		var callCount = 0;

		var formatter = new Formatter({
			'~': function(value) {
				++callCount;
			}
		});

		formatter.formatPlaceholder('0~@#$');

		this.assertEqual(1, callCount);
	},

	testExtendedCustomPlaceholderCallsProperCustomOnce: function() {
		var callCount = 0;
		var badCallCount = 0;

		var formatter = new Formatter({
			'default': function(value) {
				++badCallCount;
			},

			'~': function(value) {
				++badCallCount;
			},

			'~@': function(value) {
				++callCount;
			}
		});

		formatter.formatPlaceholder('0~@#$');

		this.assertEqual(1, callCount);
		this.assertEqual(0, badCallCount);
	},

	testCustomPlaceholderCallsCustomWithValue: function() {
		var callValue = undefined;

		var formatter = new Formatter({
			'~': function(value) {
				callValue = value;
			}
		});

		formatter.formatPlaceholder('0~', [ 10 ]);

		this.assertEqual(10, callValue);
	},

	testCustomPlaceholderUsesCustomReturnValue: function() {
		var formatter = new Formatter({
			'~': function(value) {
				return 'bar';
			}
		});

		this.assertEqual('bar', formatter.formatPlaceholder('0~'));
	}
});
