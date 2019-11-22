# Plugins Tests
This directory contains the plugins tests.

## Setup
If you are going to run against Sauce Labs, you need to
setup your SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables as they are listed
on https://saucelabs.com/appium/tutorial/3.


## Running the units tests in Sauce Labs

Run:

```
$ npx intern config=@sauce
```

## Running the unit tests locally


```
$ npx intern
```

## Running the tests from a browser

Navigate to
http://localhost/requirejs-dplugins/node_modules/intern/client.html?config=tests/intern&suites=requirejs-dplugins/tests/unit/all.

(after adjusting for your path to the requirejs-dplugins directory)