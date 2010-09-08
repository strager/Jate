(function () {
    var UDate = require('../src/udate').UDate;
    var assert = require('assert');
    var assertHasFieldsSet = require('./extensions').hasFieldsSet;

    exports.testFlatConstructorSetsFields = function () {
        assertHasFieldsSet.call(this, {
            'year': 2007,
            'month': 4,
            'day': 22,
            'hour': 14,
            'minute': 16,
            'second': 59,
            'millisecond': 400,
            'utcOffset': 0
        }, UDate(
            2007,
            4,
            22,
            14,
            16,
            59,
            400,
            0
        ));
    };

    exports.testObjectConstructorSetsFields = function () {
        assertHasFieldsSet.call(this, {
            'year': 2007,
            'month': 4,
            'day': 22,
            'hour': 14,
            'minute': 16,
            'second': 59,
            'millisecond': 400,
            'utcOffset': 0
        }, UDate({
            'year': 2007,
            'month': 4,
            'day': 22,
            'hour': 14,
            'minute': 16,
            'second': 59,
            'millisecond': 400,
            'utcOffset': 0
        }));
    };

    exports.testFromDate = function () {
        assertHasFieldsSet.call(this, {
            'year': 2007,
            'month': 4,
            'day': 22,
            'hour': 14,
            'minute': 16,
            'second': 59,
            'millisecond': 400
        }, UDate.FromDate(new Date(
            2007,
            4,
            22,
            14,
            16,
            59,
            400
        )));
    };

    exports.testToTimezone = function () {
        assertHasFieldsSet.call(this, {
            'year': 2007,
            'month': 4,
            'day': 22,
            'hour': 14,
            'minute': 16,
            'second': 59,
            'millisecond': 400,
            'utcOffset': 0
        }, UDate(
            2007,
            4,
            22,
            16,
            16,
            59,
            400,
            120
        ).toTimezone(0));
    };

    exports.testNormalized = function () {
        assertHasFieldsSet.call(this, {
            'year': 2001,
            'month': 1,
            'day': 1,
            'hour': 1,
            'minute': 1,
            'second': 1,
            'millisecond': 0,
            'utcOffset': 0
        }, UDate(
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
        }, UDate(
            2000,
            0,
            0,
            0,
            0,
            0,
            -1,
            0
        ).normalized());
    };

    exports.testFromUnixTime = function () {
        assertHasFieldsSet.call(this, {
            'year': 2003,
            'month': 8,
            'day': 1,
            'hour': 7,
            'minute': 46,
            'second': 40,
            'millisecond': 0,
            'utcOffset': 0
        }, UDate.FromUnixTime(1062402400));

        assertHasFieldsSet.call(this, {
            'year': 2010,
            'month': 11,
            'day': 30,
            'hour': 23,
            'minute': 0,
            'second': 0,
            'millisecond': 820,
            'utcOffset': 0
        }, UDate.FromUnixTime(1293750000.82));
    };

    exports.testToUnixTime = function () {
        assert.equal(1062402400, UDate({
            'year': 2003,
            'month': 8,
            'day': 1,
            'hour': 7,
            'minute': 46,
            'second': 40,
            'millisecond': 0,
            'utcOffset': 0
        }).toUnixTime());

        assert.equal(1293750000.82, UDate({
            'year': 2010,
            'month': 11,
            'day': 30,
            'hour': 21,
            'minute': 0,
            'second': 0,
            'millisecond': 820,
            'utcOffset': -120
        }).toUnixTime());
    };

    exports.testGetDayOfWeek = function () {
        assert.equal(1, (UDate.FromUnixTime(1062419200)).getDayOfWeek());
        assert.equal(2, (UDate.FromUnixTime(1062505600)).getDayOfWeek());
        assert.equal(3, (UDate.FromUnixTime(1062592000)).getDayOfWeek());
        assert.equal(4, (UDate.FromUnixTime(1062678400)).getDayOfWeek());
        assert.equal(5, (UDate.FromUnixTime(1062764800)).getDayOfWeek());
        assert.equal(6, (UDate.FromUnixTime(1062851200)).getDayOfWeek());
        assert.equal(0, (UDate.FromUnixTime(1062937600)).getDayOfWeek());
    };

    exports.testFormat = function () {
        assert.equal('2004-03-12T15:19:21+00:00', (UDate(2004, 2, 12, 15, 19, 21)).format('c'));
        assert.equal('07:09:40 m is month', (UDate.FromUnixTime(1062402400)).format('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h'));
        assert.equal('September 2, 2003, 12:26 am', (UDate.FromUnixTime(1062462400)).format('F j, Y, g:i a'));
        assert.equal('2003 36 2003', (UDate.FromUnixTime(1062462400)).format('Y W o'));
        assert.equal('53', (UDate.FromUnixTime(1104534000)).format('W'));
        assert.equal('53', (UDate.FromUnixTime(1104620400)).format('W'));
        assert.equal('999 31', (UDate.FromUnixTime(1104533999)).format('B t'));
        assert.equal('52 1293750000', (UDate.FromUnixTime(1293750000.82)).format('W U'));
        assert.equal('52', (UDate.FromUnixTime(1293836400)).format('W'));
        assert.equal('52 2011-01-02', (UDate.FromUnixTime(1293974054)).format('W Y-m-d'));
    };

    exports.testFormatParts = function () {
        var date = UDate.FromUnixTime(1234567890).toTimezone(-5 * 60);

        assert.equal('pm', date.format('a'), 'a');
        assert.equal('b', date.format('b'), 'b');
        assert.equal('2009-02-13T18:31:30-05:00', date.format('c'), 'c');
        assert.equal('13', date.format('d'), 'd');
        //assert.equal('America/New_York', date.format('e'), 'e');
        assert.equal('f', date.format('f'), 'f');
        assert.equal('6', date.format('g'), 'g');
        assert.equal('06', date.format('h'), 'h');
        assert.equal('31', date.format('i'), 'i');
        assert.equal('13', date.format('j'), 'j');
        assert.equal('k', date.format('k'), 'k');
        assert.equal('Friday', date.format('l'), 'l');
        assert.equal('02', date.format('m'), 'm');
        assert.equal('2', date.format('n'), 'n');
        assert.equal('2009', date.format('o'), 'o');
        assert.equal('p', date.format('p'), 'p');
        assert.equal('q', date.format('q'), 'q');
        assert.equal('Fri, 13 Feb 2009 18:31:30 -0500', date.format('r'), 'r');
        assert.equal('30', date.format('s'), 's');
        assert.equal('28', date.format('t'), 't');
        assert.equal('u', date.format('u'), 'u');
        assert.equal('v', date.format('v'), 'v');
        assert.equal('5', date.format('w'), 'w');
        assert.equal('x', date.format('x'), 'x');
        assert.equal('09', date.format('y'), 'y');
        assert.equal('43', date.format('z'), 'z');
        assert.equal('PM', date.format('A'), 'A');
        assert.equal('021', date.format('B'), 'B');
        assert.equal('C', date.format('C'), 'C');
        assert.equal('Fri', date.format('D'), 'D');
        assert.equal('E', date.format('E'), 'E');
        assert.equal('February', date.format('F'), 'F');
        assert.equal('18', date.format('G'), 'G');
        assert.equal('18', date.format('H'), 'H');
        //assert.equal('0', date.format('I'), 'I');
        assert.equal('J', date.format('J'), 'J');
        assert.equal('K', date.format('K'), 'K');
        assert.equal('0', date.format('L'), 'L');
        assert.equal('Feb', date.format('M'), 'M');
        assert.equal('5', date.format('N'), 'N');
        assert.equal('-0500', date.format('O'), 'O');
        assert.equal('-05:00', date.format('P'), 'P');
        assert.equal('Q', date.format('Q'), 'Q');
        assert.equal('R', date.format('R'), 'R');
        //assert.equal('th', date.format('S'), 'S');
        //assert.equal('EST', date.format('T'), 'T');
        assert.equal('1234567890', date.format('U'), 'U');
        assert.equal('V', date.format('V'), 'V');
        assert.equal('07', date.format('W'), 'W');
        assert.equal('X', date.format('X'), 'X');
        assert.equal('2009', date.format('Y'), 'Y');
        assert.equal('-18000', date.format('Z'), 'Z');
    };

    exports.testSFormatCallsTranslator = function () {
        var expectedAsserts = 3, asserts = 0;
        var date = UDate(0, 0, 4, 0, 0, 0);

        function translator(format, day) {
            assert.equal(4, day);
            ++asserts;

            assert.equal('{0ord}', format);
            ++asserts;

            return 'foobar';
        }

        assert.equal('foobar', date.format('S', translator));
        ++asserts;

        assert.equal(expectedAsserts, asserts, 'expected asserts');
    };

    exports.testDFormatCallsTranslator = function () {
        var expectedAsserts = 2, asserts = 0;
        var date = UDate(2000, 1, 0, 0, 0, 0);

        function translator(format) {
            assert.equal('Mon', format);
            ++asserts;

            return 'foobar';
        }

        assert.equal('foobar', date.format('D', translator));
        ++asserts;

        assert.equal(expectedAsserts, asserts, 'expected asserts');
    };

    if (require.main === module) {
        require('patr/runner').run(exports);
    }
}());
