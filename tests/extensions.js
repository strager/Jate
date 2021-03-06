function assertThrows() {
    var comment, type, callback, exception;

    if (arguments.length >= 3)
    {
        comment = arguments[0];
        type = arguments[1];
        callback = arguments[2];
    }
    else if (arguments.length === 2)
    {
        type = arguments[0];
        callback = arguments[1];
    }
    else
    {
        callback = arguments[0];
    }

    try {
        callback();
    } catch (e) {
        exception = e;
    }

    if (!exception)
    {
        fail(comment || 'Throws');
    }

    if (type)
    {
        assertEquals(comment || 'Throws ' + type, type, exception.name);
    }
}

function assertHasFieldsSet(expected, actual, comment) {
    var key;

    for (key in expected) {
        if (expected.hasOwnProperty(key)) {
            assertEquals((comment || '') + ' (' + key + ')', expected[key], actual[key]);
        }
    }
}

function test(a, b, c) {
    return window.TestCase(a, b, c);
}
