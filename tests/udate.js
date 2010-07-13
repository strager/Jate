(function () {
    function assertHasFieldsSet(expected, actual, comment) {
        var key;

        for (key in expected) {
            if (expected.hasOwnProperty(key)) {
                assertEquals((comment || '') + ' (' + key + ')', expected[key], actual[key]);
            }
        }
    }

    TestCase('UDate', {
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

        testToUnixTime: function () {
            assertEquals(1062402400, new Jate.UDate({
                'year': 2003,
                'month': 8,
                'day': 1,
                'hour': 7,
                'minute': 46,
                'second': 40,
                'millisecond': 0,
                'utcOffset': 0
            }).toUnixTime());

            assertEquals(1293750000.82, new Jate.UDate({
                'year': 2010,
                'month': 11,
                'day': 30,
                'hour': 21,
                'minute': 0,
                'second': 0,
                'millisecond': 820,
                'utcOffset': -120
            }).toUnixTime());
        },

        testGetDayOfWeek: function () {
            assertEquals(1, (new Jate.UDate.FromUnixTime(1062419200)).getDayOfWeek());
            assertEquals(2, (new Jate.UDate.FromUnixTime(1062505600)).getDayOfWeek());
            assertEquals(3, (new Jate.UDate.FromUnixTime(1062592000)).getDayOfWeek());
            assertEquals(4, (new Jate.UDate.FromUnixTime(1062678400)).getDayOfWeek());
            assertEquals(5, (new Jate.UDate.FromUnixTime(1062764800)).getDayOfWeek());
            assertEquals(6, (new Jate.UDate.FromUnixTime(1062851200)).getDayOfWeek());
            assertEquals(0, (new Jate.UDate.FromUnixTime(1062937600)).getDayOfWeek());
        },

        testFormat: function () {
            assertEquals('2004-03-12T15:19:21+00:00', (new Jate.UDate(2004, 2, 12, 15, 19, 21)).format('c'));
            assertEquals('07:09:40 m is month', (new Jate.UDate.FromUnixTime(1062402400)).format('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h'));
            assertEquals('September 2, 2003, 12:26 am', (new Jate.UDate.FromUnixTime(1062462400)).format('F j, Y, g:i a'));
            assertEquals('2003 36 2003', (new Jate.UDate.FromUnixTime(1062462400)).format('Y W o'));
            assertEquals('53', (new Jate.UDate.FromUnixTime(1104534000)).format('W'));
            assertEquals('53', (new Jate.UDate.FromUnixTime(1104620400)).format('W'));
            assertEquals('999 31', (new Jate.UDate.FromUnixTime(1104533999)).format('B t'));
            assertEquals('52 1293750000', (new Jate.UDate.FromUnixTime(1293750000.82)).format('W U'));
            assertEquals('52', (new Jate.UDate.FromUnixTime(1293836400)).format('W'));
            assertEquals('52 2011-01-02', (new Jate.UDate.FromUnixTime(1293974054)).format('W Y-m-d'));
        },

        testFormatParts: function () {
            var date = new Jate.UDate.FromUnixTime(1234567890).toTimezone(-5 * 60);

            assertEquals('a', 'pm', date.format('a'));
            assertEquals('b', 'b', date.format('b'));
            assertEquals('c', '2009-02-13T18:31:30-05:00', date.format('c'));
            assertEquals('d', '13', date.format('d'));
            //assertEquals('e', 'America/New_York', date.format('e'));
            assertEquals('f', 'f', date.format('f'));
            assertEquals('g', '6', date.format('g'));
            assertEquals('h', '06', date.format('h'));
            assertEquals('i', '31', date.format('i'));
            assertEquals('j', '13', date.format('j'));
            assertEquals('k', 'k', date.format('k'));
            assertEquals('l', 'Friday', date.format('l'));
            assertEquals('m', '02', date.format('m'));
            assertEquals('n', '2', date.format('n'));
            assertEquals('o', '2009', date.format('o'));
            assertEquals('p', 'p', date.format('p'));
            assertEquals('q', 'q', date.format('q'));
            assertEquals('r', 'Fri, 13 Feb 2009 18:31:30 -0500', date.format('r'));
            assertEquals('s', '30', date.format('s'));
            assertEquals('t', '28', date.format('t'));
            assertEquals('u', 'u', date.format('u'));
            assertEquals('v', 'v', date.format('v'));
            assertEquals('w', '5', date.format('w'));
            assertEquals('x', 'x', date.format('x'));
            assertEquals('y', '09', date.format('y'));
            assertEquals('z', '43', date.format('z'));
            assertEquals('A', 'PM', date.format('A'));
            assertEquals('B', '021', date.format('B'));
            assertEquals('C', 'C', date.format('C'));
            assertEquals('D', 'Fri', date.format('D'));
            assertEquals('E', 'E', date.format('E'));
            assertEquals('F', 'February', date.format('F'));
            assertEquals('G', '18', date.format('G'));
            assertEquals('H', '18', date.format('H'));
            //assertEquals('I', '0', date.format('I'));
            assertEquals('J', 'J', date.format('J'));
            assertEquals('K', 'K', date.format('K'));
            assertEquals('L', '0', date.format('L'));
            assertEquals('M', 'Feb', date.format('M'));
            assertEquals('N', '5', date.format('N'));
            assertEquals('O', '-0500', date.format('O'));
            assertEquals('P', '-05:00', date.format('P'));
            assertEquals('Q', 'Q', date.format('Q'));
            assertEquals('R', 'R', date.format('R'));
            //assertEquals('S', 'th', date.format('S'));
            //assertEquals('T', 'EST', date.format('T'));
            assertEquals('U', '1234567890', date.format('U'));
            assertEquals('V', 'V', date.format('V'));
            assertEquals('W', '07', date.format('W'));
            assertEquals('X', 'X', date.format('X'));
            assertEquals('Y', '2009', date.format('Y'));
            assertEquals('Z', '-18000', date.format('Z'));
        },

        testSFormatCallsTranslator: function () {
            expectAsserts(3);

            var date = new Jate.UDate(0, 0, 4, 0, 0, 0);
            var translatorCalled = false;

            function translator(format, day) {
                assertEquals(4, day);
                assertEquals('{0ord}', format);
                translatorCalled = true;

                return 'foobar';
            }

            assertEquals('foobar', date.format('S', translator));
        },

        testDFormatCallsTranslator: function () {
            expectAsserts(2);

            var date = new Jate.UDate(2000, 1, 0, 0, 0, 0);
            var translatorCalled = false;

            function translator(format) {
                assertEquals('Mon', format);
                translatorCalled = true;

                return 'foobar';
            }

            assertEquals('foobar', date.format('D', translator));
        }
    });
}());
