/*
 * Class: Jate.UDate
 * UDate represents a date and time, coupled with timezone information.
 *
 * Unlike the native Date class, UDate's representation does not change
 * depending upon local system settings.
 *
 * UDate uses the Gregorian calendar for all dates.  It uses standard
 * 24-hour time.
 *
 * Property: year
 * Year, e.g. 2010.
 *
 * Property: month
 * Month starting from 0 (January), going to 11 (December).
 *
 * Property: day
 * Day starting from 1.
 *
 * Property: hour
 * Military-time hour, ranging from 0 to 23.
 *
 * Property: minute
 * Minute, ranging from 0 to 59.
 *
 * Property: second
 * Second, ranging from 0 to 59.
 *
 * Property: millisecond
 * Millisecond, ranging from 0 to 999.999....
 *
 * Property: utcOffset
 * Minutes the date-time is from its UTC representation.  E.g. -120 for GMT-0200.
 */

/*
 * Constructor: Constructor
 * Creates a new UDate from date parts.
 *
 * Parameters:
 * Either a single object containing date parts, or a list of parameters in the following order:
 *
 * year, month, day, hour, minute, second, millisecond, utcOffset
 */ 
Jate.UDate = function (year, month, day, hour, minute, second, millisecond, utcOffset) {
    var i, args;

    args = 'year,month,day,hour,minute,second,millisecond,utcOffset'.split(',');

    for (i = 0; i < args.length; ++i) {
        this[args[i]] = 0;
    }

    if (typeof year === 'object') {
        // First arg is a time object (like defaults).
        for (i = 0; i < args.length; ++i) {
            if (!year.hasOwnProperty(args[i])) {
                continue;
            }

            this[args[i]] = year[args[i]];
        }
    } else {
        // Initialize from args.
        for (i = 0; i < arguments.length; ++i) {
            this[args[i]] = arguments[i];
        }
    }
};

/*
 * Constructor: FromDate
 * Creates a UDate from a built-in Date object.
 *
 * Parameters:
 * date - Date object to convert.
 */
Jate.UDate.FromDate = function (date) {
    return new Jate.UDate({
        'year': date.getFullYear(),
        'month': date.getMonth(),
        'day': date.getDate(),
        'hour': date.getHours(),
        'minute': date.getMinutes(),
        'second': date.getSeconds(),
        'millisecond': date.getMilliseconds(),
        'utcOffset': -date.getTimezoneOffset()
    });
};

/*
 * Constructor: FromUnixTime
 * Creates a UDate from a UNIX time integer.
 *
 * Parameters:
 * unixTime - Number of seconds from the UNIX epoch (1970-01-01T00:00:00Z).
 */
Jate.UDate.FromUnixTime = function (unixTime) {
    var date = new Date(unixTime * 1000);
    var utc = (new Jate.UDate.FromDate(date)).toUtc();

    return utc;
};

/*
 * Method: toLocal
 * Transforms the UDate instance into one which uses the
 * system's local timezone.
 *
 * Returns:
 * New UDate instance with local timezone.
 */
Jate.UDate.prototype.toLocal = function () {
    return this.toTimezone(-Date.getTimezoneOffset());
};

/*
 * Method: toUtc
 * Transforms the UDate instance into one which uses the
 * GMT timezone.
 *
 * Returns:
 * New UDate instance with GMT timezone.
 */
Jate.UDate.prototype.toUtc = function () {
    return this.toTimezone(0);
};

/*
 * Method: toTimezone
 * Transforms the UDate instance into one which uses the
 * specified utcOffset.
 *
 * Parameters:
 * utcOffset - New utcOffset to use.
 *
 * Returns:
 * New UDate instance with utcOffset.
 */
Jate.UDate.prototype.toTimezone = function (utcOffset) {
    var date = new Jate.UDate(this),
        utcOffsetDelta = utcOffset - date.utcOffset;

    date.utcOffset = utcOffset;
    date.minute += utcOffsetDelta;

    return date.normalized();
};

/*
 * Method: toUnixTime
 * Converts the UDate instance into a UNIX timestamp.
 *
 * Returns:
 * The number of seconds since the UNIX epoch.
 */
Jate.UDate.prototype.toUnixTime = function () {
    var tempDate = this.toUtc();

    return Date.UTC(
        tempDate.year,
        tempDate.month,
        tempDate.day,
        tempDate.hour,
        tempDate.minute,
        tempDate.second,
        tempDate.millisecond
    ) / 1000;
};

/*
 * Method: toDate
 * Converts the UDate instance into a native Date instance.
 *
 * Returns:
 * Date instance representing the same time as the
 * UDate instance.
 */
Jate.UDate.prototype.toDate = function () {
    return new Date(this.toUnixTime() * 1000);
};

/*
 * Method: normalized
 * Normalizes a date.
 *
 * A normalized date has all values which are within range.
 * This means milliseconds is between 0 and 999.999...,
 * hour is between 0 and 23, etc.  If, for example, second
 * is 60, second resets to 0 and minute rounds up.  Date
 * parts are rounded down similarly.
 *
 * Returns:
 * Normalized UDate instance.
 */
Jate.UDate.prototype.normalized = function () {
    var tempDate = new Date(Date.UTC(
        this.year,
        this.month,
        this.day,
        this.hour,
        this.minute,
        this.second,
        this.millisecond
    ));

    return new Jate.UDate(
        tempDate.getUTCFullYear(),
        tempDate.getUTCMonth(),
        tempDate.getUTCDate(),
        tempDate.getUTCHours(),
        tempDate.getUTCMinutes(),
        tempDate.getUTCSeconds(),
        tempDate.getUTCMilliseconds(),
        this.utcOffset
    );
};

/*
 * Method: static isLeapYear
 * Calculates if the given year is a leap year.
 *
 * A leap year contains one extra day in February.
 *
 * Parameters:
 * year - The year to test.
 *
 * Returns:
 * true if the year is a leap year; false otherwise.
 */
Jate.UDate.isLeapYear = function (year) {
    return (year % 4 === 0 && year % 100 !== 0) ||
           (year % 400 === 0);
};

/*
 * Method: isLeapYear
 * See: static isLeapYear
 */
Jate.UDate.prototype.isLeapYear = function () {
    return Jate.UDate.isLeapYear(this.year);
};

/*
 * Method: static getDaysInMonth
 * Calculates the number of days in the given month
 *
 * Parameters:
 * month - The month to test.
 * year or isLeapYear - The year the month is in, or true or false if the year is a leap year or not.
 *
 * Returns:
 * The number of days in the given month.
 */
Jate.UDate.getDaysInMonth = function (month, year /* or isLeapYear */) {
    var isLeapYear;

    if (typeof year === 'number') {
        isLeapYear = Jate.UDate.isLeapYear(year);
    } else {
        isLeapYear = !!year;
    }

    var daysPerMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    var daysPerMonthLeap = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    if (isLeapYear) {
        return daysPerMonthLeap[month];
    } else {
        return daysPerMonth[month];
    }
};

/*
 * Method: getDaysInMonth
 * See: static getDaysInMonth.
 */
Jate.UDate.prototype.getDaysInMonth = function () {
    return Jate.UDate.getDaysInMonth(this.month, this.year);
};

/*
 * Method: static getDayOfYear
 * Calculates which day of the year the given day/month pair is.
 *
 * For example, 1 January is the 0th day, and 31 December is the
 * 365th or 364th day (depending upon if the year is a leap year
 * or not, respectively).
 *
 * Parameters:
 * day - Day of the month.
 * month - Month of the year.
 * year - Year.
 *
 * Returns:
 * The day of the year.
 */
Jate.UDate.getDayOfYear = function (day, month, year) {
    var curMonth;

    for (curMonth = 0; curMonth < month; ++curMonth) {
        day += Jate.UDate.getDaysInMonth(curMonth, year);
    }

    return day - 1;
};

/*
 * Method: getDayOfYear
 * See: static getDayOfYear
 */
Jate.UDate.prototype.getDayOfYear = function () {
    return Jate.UDate.getDayOfYear(this.day, this.month, this.year);
};

/*
 * Method: getDayOfWeek
 * Calculates the day of the week the date lies on.
 *
 * 0 represents Sunday, and 6 represents Saturday.
 *
 * Returns:
 * Index of the day of the week.
 */
Jate.UDate.prototype.getDayOfWeek = function () {
    return this.toDate().getUTCDay();
};

/*
 * Method: getWeekOfYear
 * TODO Document.
 */
Jate.UDate.prototype.getWeekOfYear = function () {
    var a, b, isoDayOfWeek = this.getDayOfWeek();

    if (isoDayOfWeek === 0) {
        isoDayOfWeek = 7;
    }

    a = (new Jate.UDate(this.year, this.month, this.day - isoDayOfWeek + 4)).normalized();
    b = (new Jate.UDate(a.year, 0, 4)).normalized();

    return 1 + Math.round((a.toUnixTime() - b.toUnixTime()) / 864e2 / 7);
};

/*
 * Method: format
 * Formats the date like PHP's date function.
 *
 * http://php.net/manual/en/function.date.php
 *
 * Parameters:
 * format - The format string.  See PHP's date documentation
 *          for details.
 * translator - Optional.  The function to execute for translatable
 *              elements (e.g. week and month names).
 *
 * Returns:
 * Formatted date string.
 */
Jate.UDate.prototype.format = function (format, translator) {
    var func = arguments.callee,
        replacements = func.replaceChars,
        returnStr = '',
        i, curChar;

    translator = translator || function (x) {
        return x;
    };

    for (i = 0; i < format.length; ++i) {
        curChar = format.charAt(i);

        if (curChar === '\\') {
            ++i;
            curChar = format.charAt(i);
            returnStr += curChar;
        } else if (replacements.hasOwnProperty(curChar)) {
            if (typeof replacements[curChar] !== 'function') {
                throw new Error('Unsupported format character: ' + curChar);
            }

            returnStr += replacements[curChar].call(this, translator);
        } else {
            returnStr += curChar;
        }
    }

    return returnStr;
};

(function () {
    function pad(number, amount) {
        if (typeof amount === 'undefined') {
            amount = 2;
        }

        var ret = '' + number;

        while (ret.length < amount) {
            ret = '0' + ret;
        }

        return ret;
    }

    var r = Jate.UDate.prototype.format.replaceChars = {
        shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        
        // Day
        d: function () {
            return pad(this.day);
        },

        D: function (t) {
            return t(r.shortDays[this.getDayOfWeek()]);
        },

        j: function () {
            return this.day;
        },

        l: function (t) {
            return t(r.longDays[this.getDayOfWeek()]);
        },

        N: function () {
            var dayOfWeek = this.getDayOfWeek();

            return dayOfWeek === 0 ? 7 : dayOfWeek;
        },

        S: function (t) {
            return t('{0ord}', this.day);
        },

        w: function () {
            return this.getDayOfWeek();
        },

        z: function () {
            return this.getDayOfYear();
        },

        // Week
        W: function () {
            return pad(this.getWeekOfYear());
        },

        // Month
        F: function (t) {
            return t(r.longMonths[this.month]);
        },

        m: function () {
            return pad(this.month + 1);
        },

        M: function (t) {
            return t(r.shortMonths[this.month]);
        },

        n: function () {
            return this.month + 1;
        },

        t: function () {
            return this.getDaysInMonth();
        },

        // Year
        L: function () {
            return this.isLeapYear() ? '1' : '0';
        },

        o: function () {
            var weekOfYear = this.getWeekOfYear();
            var year = this.year;

            if (this.month === 11 && weekOfYear < 9) {
                --year;
            } else if (this.month === 0 && weekOfYear > 9) {
                ++year;
            }

            return year;
        },

        Y: function () {
            return this.year;
        },

        y: function () {
            return pad(this.year % 100);
        },

        // Time
        a: function (t) {
            return t(this.hour < 12 ? 'am' : 'pm');
        },

        A: function (t) {
            return t(this.hour < 12 ? 'AM' : 'PM');
        },

        B: function () {
            var date = this.toTimezone(1 * 60);
            var raw = (((date.second / 60) + date.minute) / 60 + date.hour) / 24;

            return pad(Math.floor(raw * 1000), 3);
        },

        g: function () {
            return this.hour % 12 || 12;
        },

        G: function () {
            return this.hour;
        },

        h: function (t) {
            return pad(r.g.call(this, t));
        },

        H: function () {
            return pad(this.hour);
        },

        i: function () {
            return pad(this.minute);
        },

        s: function () {
            return pad(this.second);
        },

        // Timezone
        e: null,

        I: null,

        O: function (t) {
            return r.P.call(this, t).replace(/:/, '');
        },

        P: function () {
            return (this.utcOffset < 0 ? '-' : '+') +
                pad(Math.abs(this.utcOffset / 60)) + ':' +
                pad(Math.abs(this.utcOffset % 60));
        },

        T: null,

        Z: function () {
            return this.utcOffset * 60;
        },

        // Full Date/Time
        c: function () {
            return this.format('Y-m-d') + 'T' + this.format('H:i:sP');
        },

        r: function () {
            return this.format('D, d M Y H:i:s O');
        },

        U: function () {
            return Math.floor(this.toUnixTime());
        }
    };
}());
