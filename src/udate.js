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
    return this.toTimezone(Date.getTimezoneOffset());
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
            return this.getDayOfWeek() + 1;
        },

        //S: function () {
        //    return (this.date % 10 == 1 && this.date != 11 ? 'st' : (this.date % 10 == 2 && this.date != 12 ? 'nd' : (this.date % 10 == 3 && this.date != 13 ? 'rd' : 'th')));
        //},

        w: function () {
            return this.getDayOfWeek();
        },

        z: function () {
            return "Not Yet Supported";
        },

        // Week
        W: function () {
            return "Not Yet Supported";
        },

        // Month
        F: function (t) {
            return t(r.longMonths[this.month]);
        },

        m: function () {
            return pad(this.month);
        },

        M: function (t, r) {
            return t(r.shortMonths[this.month]);
        },

        n: function () {
            return this.month + 1;
        },

        t: function () {
            return "Not Yet Supported";
        },

        // Year
        L: function () {
            return (((this.fullYear % 4 === 0) && (this.fullYear % 100 !== 0)) || (this.fullYear % 400 === 0)) ? '1' : '0';
        },

        o: function () {
            return "Not Supported";
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
            return "Not Yet Supported";
        },

        g: function () {
            return this.hour % 12 || 12;
        },

        G: function () {
            return this.hour;
        },

        h: function (t) {
            return pad(r.g(t));
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
        e: function () {
            return "Not Yet Supported";
        },

        I: function () {
            return "Not Supported";
        },

        O: function () {
            return (-this.utcOffset < 0 ? '-' : '+') + (Math.abs(this.utcOffset / 60) < 10 ? '0' : '') + (Math.abs(this.utcOffset / 60)) + '00';
        },

        P: function () {
            return (-this.utcOffset < 0 ? '-' : '+') + (Math.abs(this.utcOffset / 60) < 10 ? '0' : '') + (Math.abs(this.utcOffset / 60)) + ':' + (Math.abs(this.utcOffset % 60) < 10 ? '0' : '') + (Math.abs(this.utcOffset % 60));
        },

        T: function () {
            var m = this.month;
            this.setMonth(0);
            var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1');
            this.setMonth(m);
            return result;
        },

        Z: function () {
            return -this.utcOffset * 60;
        },

        // Full Date/Time
        c: function () {
            return this.format("Y-m-d") + "T" + this.format("H:i:sP");
        },

        r: function () {
            return this.toString();
        },

        U: function () {
            return this.time / 1000;
        }
    };
}());
