var require = {
  paths : {
    "test-utils"    : "../src/js/test-utils",
    "test-case"     : "../src/js/test-case",
    "mockjax-utils" : "../src/js/mockjax-utils",
    lib             : "../src/js/lib",
    jquery          : "../src/js/lib/jquery-2.1.1",
    jquery_mockjax  : "../src/js/lib/jquery.mockjax",
    handlebars      : "../src/js/lib/handlebars",
    ember           : "../src/js/lib/ember",
    ember_qunit     : "../src/js/lib/ember-qunit",
  },
  shim : {
    jquery_mockjax : [ "jquery" ],
    ember : {
      deps : [ "jquery", "handlebars"],
      exports : "Ember",
    },
    ember_qunit : {
      deps : [ "ember" ],
      exports : "emq",
    },
  },
  waitSeconds : 10,
};
