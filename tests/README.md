# i18n Plugin Tests
This directory contains the i18n plugin tests.

## Setup
Before starting, install Intern, Grunt and RequireJS by running

```
$ npm install
```

## Running the unit and functional tests locally

1) Download selenium server 2.37.0 (http://www.seleniumhq.org/download/) and start it on the default port (4444):

```
$ java -jar selenium-server-standalone-2.37.0.jar
```

2) Edit local.js to list which browsers to test

3) Run the tests:

```
grunt intern
```
