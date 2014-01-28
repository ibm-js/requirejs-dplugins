# i18n Plugin Tests
This directory contains the i18n plugin tests.

## Setup
Before starting, install Intern and RequireJS by running

```
$ npm install
```

Also, if you are going to run against Sauce Labs, then
setup your SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables as they are listed
on https://saucelabs.com/appium/tutorial/3.


## Running the functional tests in Sauce Labs

Run:

```
$ node node_modules/intern/runner.js config=tests/sauce
```
## Running the functional tests locally

1) Download selenium server 2.37.0 (http://www.seleniumhq.org/download/) and start it on the default port (4444):

```
$ java -jar selenium-server-standalone-2.37.0.jar
```

2) Edit local.js to list which browsers to test

3) Run the tests:

```
$ node node_modules/intern/runner.js config=tests/locale
```