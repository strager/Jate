## Documentation

Documentation can be generated using [Natural Docs][1] on the `src` directory.
For example:

    mkdir -p docs && NaturalDocs -i src -o HTML docs -p natural-docs

[1]: http://www.naturaldocs.org

## Testing

Unit testing can be performed using [JsTestDriver][2].  For example:

    java -jar JsTestDriver.jar --port 1234
    mybrowser http://localhost:1234/capture
    java -jar JsTestDriver.jar --server http://localhost:1234 --tests all

[2]: http://code.google.com/p/js-test-driver/
