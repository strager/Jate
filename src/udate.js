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

Jate.UDate.FromDate = function (date) {
    Jate.UDate.call(this, {
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

Jate.UDate.FromDate.prototype = Jate.UDate.prototype;

Jate.UDate.FromUnixTime = function (unixTime) {
    var date = new Date(unixTime * 1000);
    var utc = (new Jate.UDate.FromDate(date)).toUtc();
    var i;

    for (i in utc) {
        if (utc.hasOwnProperty(i)) {
            this[i] = utc[i];
        }
    }
};

Jate.UDate.FromUnixTime.prototype = Jate.UDate.prototype;

Jate.UDate.prototype.toLocal = function () {
    return this.toTimezone(-Date.getTimezoneOffset());
};

Jate.UDate.prototype.toUtc = function () {
    return this.toTimezone(0);
};

Jate.UDate.prototype.toTimezone = function (utcOffset) {
    var date = new Jate.UDate(this),
        utcOffsetDelta = utcOffset - date.utcOffset;

    date.utcOffset = utcOffset;
    date.minute += utcOffsetDelta;

    return date.normalized();
};

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

Jate.UDate.prototype.toDate = function () {
    return new Date(this.toUnixTime() * 1000);
};

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

Jate.UDate.isLeapYear = function (year) {
    return (year % 4 === 0 && year % 100 !== 0) ||
           (year % 400 === 0);
};

Jate.UDate.prototype.isLeapYear = function () {
    return Jate.UDate.isLeapYear(this.year);
};

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

Jate.UDate.prototype.getDaysInMonth = function () {
    return Jate.UDate.getDaysInMonth(this.month, this.year);
};

Jate.UDate.getDayOfYear = function (day, month, year) {
    var curMonth;

    for (curMonth = 0; curMonth < month; ++curMonth) {
        day += Jate.UDate.getDaysInMonth(curMonth, year);
    }

    return day - 1;
};

Jate.UDate.prototype.getDayOfYear = function () {
    return Jate.UDate.getDayOfYear(this.day, this.month, this.year);
};

Jate.UDate.prototype.getDayOfWeek = function () {
    return this.toDate().getUTCDay();
};

Jate.UDate.prototype.getWeekOfYear = function () {
    var a, b, isoDayOfWeek = this.getDayOfWeek();

    if (isoDayOfWeek === 0) {
        isoDayOfWeek = 7;
    }

    a = (new Jate.UDate(this.year, this.month, this.day - isoDayOfWeek + 4)).normalized();
    b = (new Jate.UDate(a.year, 0, 4)).normalized();

    return 1 + Math.round((a.toUnixTime() - b.toUnixTime()) / 864e2 / 7);
};

// Adopted from Jacob Wright's original code:
// http://jacwright.com/projects/javascript/date_format
// Simulates PHP's date function; see http://php.net/manual/en/function.date.php
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
            return t('{0ord}', this.date);
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
