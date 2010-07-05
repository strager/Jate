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

        testToUnixTime: function () {
            this.assertEqual(1062402400, new Jate.UDate({
                'year': 2003,
                'month': 8,
                'day': 1,
                'hour': 7,
                'minute': 46,
                'second': 40,
                'millisecond': 0,
                'utcOffset': 0
            }).toUnixTime());

            this.assertEqual(1293750000.82, new Jate.UDate({
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
            this.assertEqual(1, (new Jate.UDate.FromUnixTime(1062419200)).getDayOfWeek());
            this.assertEqual(2, (new Jate.UDate.FromUnixTime(1062505600)).getDayOfWeek());
            this.assertEqual(3, (new Jate.UDate.FromUnixTime(1062592000)).getDayOfWeek());
            this.assertEqual(4, (new Jate.UDate.FromUnixTime(1062678400)).getDayOfWeek());
            this.assertEqual(5, (new Jate.UDate.FromUnixTime(1062764800)).getDayOfWeek());
            this.assertEqual(6, (new Jate.UDate.FromUnixTime(1062851200)).getDayOfWeek());
            this.assertEqual(0, (new Jate.UDate.FromUnixTime(1062937600)).getDayOfWeek());
        },

        testFormat: function () {
            this.assertEqual('2004-03-12T15:19:21+00:00', (new Jate.UDate(2004, 2, 12, 15, 19, 21)).format('c'));
            this.assertEqual('07:09:40 m is month', (new Jate.UDate.FromUnixTime(1062402400)).format('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h'));
            this.assertEqual('September 2, 2003, 12:26 am', (new Jate.UDate.FromUnixTime(1062462400)).format('F j, Y, g:i a'));
            this.assertEqual('2003 36 2003', (new Jate.UDate.FromUnixTime(1062462400)).format('Y W o'));
            this.assertEqual('53', (new Jate.UDate.FromUnixTime(1104534000)).format('W'));
            this.assertEqual('53', (new Jate.UDate.FromUnixTime(1104620400)).format('W'));
            this.assertEqual('999 31', (new Jate.UDate.FromUnixTime(1104533999)).format('B t'));
            this.assertEqual('52 1293750000', (new Jate.UDate.FromUnixTime(1293750000.82)).format('W U'));
            this.assertEqual('52', (new Jate.UDate.FromUnixTime(1293836400)).format('W'));
            this.assertEqual('52 2011-01-02', (new Jate.UDate.FromUnixTime(1293974054)).format('W Y-m-d'));
        },

        testFormatParts: function () {
            var date = new Jate.UDate.FromUnixTime(1234567890).toTimezone(-5 * 60);

            this.assertEqual('pm', date.format('a'), 'a');
            this.assertEqual('b', date.format('b'), 'b');
            this.assertEqual('2009-02-13T18:31:30-05:00', date.format('c'), 'c');
            this.assertEqual('13', date.format('d'), 'd');
            //this.assertEqual('America/New_York', date.format('e'), 'e');
            this.assertEqual('f', date.format('f'), 'f');
            this.assertEqual('6', date.format('g'), 'g');
            this.assertEqual('06', date.format('h'), 'h');
            this.assertEqual('31', date.format('i'), 'i');
            this.assertEqual('13', date.format('j'), 'j');
            this.assertEqual('k', date.format('k'), 'k');
            this.assertEqual('Friday', date.format('l'), 'l');
            this.assertEqual('02', date.format('m'), 'm');
            this.assertEqual('2', date.format('n'), 'n');
            this.assertEqual('2009', date.format('o'), 'o');
            this.assertEqual('p', date.format('p'), 'p');
            this.assertEqual('q', date.format('q'), 'q');
            this.assertEqual('Fri, 13 Feb 2009 18:31:30 -0500', date.format('r'), 'r');
            this.assertEqual('30', date.format('s'), 's');
            this.assertEqual('28', date.format('t'), 't');
            this.assertEqual('u', date.format('u'), 'u');
            this.assertEqual('v', date.format('v'), 'v');
            this.assertEqual('5', date.format('w'), 'w');
            this.assertEqual('x', date.format('x'), 'x');
            this.assertEqual('09', date.format('y'), 'y');
            this.assertEqual('43', date.format('z'), 'z');
            this.assertEqual('PM', date.format('A'), 'A');
            this.assertEqual('021', date.format('B'), 'B');
            this.assertEqual('C', date.format('C'), 'C');
            this.assertEqual('Fri', date.format('D'), 'D');
            this.assertEqual('E', date.format('E'), 'E');
            this.assertEqual('February', date.format('F'), 'F');
            this.assertEqual('18', date.format('G'), 'G');
            this.assertEqual('18', date.format('H'), 'H');
            //this.assertEqual('0', date.format('I'), 'I');
            this.assertEqual('J', date.format('J'), 'J');
            this.assertEqual('K', date.format('K'), 'K');
            this.assertEqual('0', date.format('L'), 'L');
            this.assertEqual('Feb', date.format('M'), 'M');
            this.assertEqual('5', date.format('N'), 'N');
            this.assertEqual('-0500', date.format('O'), 'O');
            this.assertEqual('-05:00', date.format('P'), 'P');
            this.assertEqual('Q', date.format('Q'), 'Q');
            this.assertEqual('R', date.format('R'), 'R');
            //this.assertEqual('th', date.format('S'), 'S');
            //this.assertEqual('EST', date.format('T'), 'T');
            this.assertEqual('1234567890', date.format('U'), 'U');
            this.assertEqual('V', date.format('V'), 'V');
            this.assertEqual('07', date.format('W'), 'W');
            this.assertEqual('X', date.format('X'), 'X');
            this.assertEqual('2009', date.format('Y'), 'Y');
            this.assertEqual('-18000', date.format('Z'), 'Z');
        }
    });
}());
