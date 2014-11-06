define([
  "ember",
  "./testValueAssignObject",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestValueAssignObject) {

var TestValueAssignHierarchy = [
  {
    classes : {
      "base" : TestValueAssignObject.TestValueAssignObject,
    },
    base : "base",
    keysInArray : ["type", "path", "putPath", "value", "param", "valuePath"],
  },
];
Utils.registerHierarchy(TestValueAssignHierarchy);

return TestValueAssignHierarchy;

});
