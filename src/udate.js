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
        'utcOffset': date.getTimezoneOffset()
    });
};

Jate.UDate.prototype.toLocal = function () {
    return this.toTimezone(Date.getTimezoneOffset());
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
