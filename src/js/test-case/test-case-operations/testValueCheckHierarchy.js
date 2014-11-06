define([
  "ember",
  "./testValueCheckObject",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestValueCheckObject) {

var TestValueCheckHierarchy = [
  {
    classes : {
      "base" : TestValueCheckObject.TestValueCheckObject,
    },
    base : "base",
    keysInArray : ["type", "path", "value", "message", "valuePath"],
  },
];
Utils.registerHierarchy(TestValueCheckHierarchy);

return TestValueCheckHierarchy;

});
