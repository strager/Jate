(function () {
    function assertHasFieldsSet(expected, actual, comment) {
        var key;

        for (key in expected) {
            if (expected.hasOwnProperty(key)) {
                this.assertEqual(expected[key], actual[key], (comment || '') + ' (' + key + ')');
            }
        }
    }

    test({
        testFlatConstructorSetsFields: function () {
            assertHasFieldsSet.call(this, {
                'year': 2007,
                'month': 4,
                'day': 22,
                'hour': 14,
                'minute': 16,
                'second': 59,
                'millisecond': 400,
                'utcOffset': 0
            }, new Jate.UDate(
                2007,
                4,
                22,
                14,
                16,
                59,
                400,
                0
            ));
        },

        testObjectConstructorSetsFields: function () {
            assertHasFieldsSet.call(this, {
                'year': 2007,
                'month': 4,
                'day': 22,
                'hour': 14,
                'minute': 16,
                'second': 59,
                'millisecond': 400,
                'utcOffset': 0
            }, new Jate.UDate({
                'year': 2007,
                'month': 4,
                'day': 22,
                'hour': 14,
                'minute': 16,
                'second': 59,
                'millisecond': 400,
                'utcOffset': 0
            }));
        },

        testFromDate: function () {
            assertHasFieldsSet.call(this, {
                'year': 2007,
                'month': 4,
                'day': 22,
                'hour': 14,
                'minute': 16,
                'second': 59,
                'millisecond': 400
            }, new Jate.UDate.FromDate(new Date(
                2007,
                4,
                22,
                14,
                16,
                59,
                400
            )));
        },

        testToTimezone: function () {
            assertHasFieldsSet.call(this, {
                'year': 2007,
                'month': 4,
                'day': 22,
                'hour': 14,
                'minute': 16,
                'second': 59,
                'millisecond': 400,
                'utcOffset': 0
            }, new Jate.UDate(
                2007,
                4,
                22,
                16,
                16,
                59,
                400,
                120
            ).toTimezone(0));
        },

        testNormalized: function () {
            assertHasFieldsSet.call(this, {
                'year': 2001,
                'month': 1,
                'day': 1,
                'hour': 1,
                'minute': 1,
                'second': 1,
                'millisecond': 0,
                'utcOffset': 0
            }, new Jate.UDate(
                2000,
                12,
                31,
                24,
                60,
                60,
                1000,
                0
            ).normalized());

            assertHasFieldsSet.call(this, {
                'year': 1999,
                'month': 11,
                'day': 30,
                'hour': 23,
                'minute': 59,
                'second': 59,
                'millisecond': 999,
                'utcOffset': 0
            }, new Jate.UDate(
                2000,
                0,
                0,
                0,
                0,
                0,
                -1,
                0
            ).normalized());
        },

        testFromUnixTime: function () {
            assertHasFieldsSet.call(this, {
                'year': 2003,
                'month': 8,
                'day': 1,
                'hour': 7,
                'minute': 46,
                'second': 40,
                'millisecond': 0,
                'utcOffset': 0
            }, new Jate.UDate.FromUnixTime(1062402400));

            assertHasFieldsSet.call(this, {
                'year': 2010,
                'month': 11,
                'day': 30,
                'hour': 23,
                'minute': 0,
                'second': 0,
                'millisecond': 820,
                'utcOffset': 0
            }, new Jate.UDate.FromUnixTime(1293750000.82));
        },

        testFormat: function () {
            this.assertEqual('2004-02-12T15:19:21+00:00', (new Jate.UDate(2004, 2, 12, 15, 19, 21)).format('c'));
            this.assertEqual('07:08:40 m is month', (new Jate.UDate.FromUnixTime(1062402400)).toUtc().format('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h'));
        }
    });
}());
