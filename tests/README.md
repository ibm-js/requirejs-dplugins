# Plugins Tests
This directory contains the plugins tests.

## Setup
You will need Bower and Grunt. So if they are not installed, install them using:
```
$ npm install -g grunt-cli
$ npm install -g bower
```

Once this is done you can run the following commands to setup the project dependencies:
```
$ npm install
$ bower install
```

Also, if you are going to run against Sauce Labs, you need to
setup your SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables as they are listed
on https://saucelabs.com/appium/tutorial/3.


## Running the units tests in Sauce Labs

Run:

```
$ grunt intern:remote
```

## Running the unit tests locally


```
$ grunt intern:local
```

## Running the tests from a browser

Navigate to
http://localhost/requirejs-dplugins/node_modules/intern/client.html?config=tests/intern&suites=requirejs-dplugins/tests/unit/all.

(after adjusting for your path to the requirejs-dplugins directory)