var require = {
  baseUrl : "/js",
  paths : {
    jquery         : "lib/jquery-2.1.1",
    jquery_mockjax : "lib/jquery.mockjax",
    handlebars     : "lib/handlebars",
    ember          : "lib/ember",
    ember_data     : "lib/ember-data",
  },
  shim : {
    jquery_mockjax : [ "jquery" ],
    ember : {
      deps : [ "jquery", "handlebars" ],
      exports : "Ember",
    },
    ember_data : {
      deps : [ "ember" ],
      exports : "DS",
    },
  },
};
