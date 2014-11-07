define([
  "ember",
  "./testAssignValueObject",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestAssignValueObject) {

var TestAssignValueHierarchy = [
  {
    classes : {
      "base" : TestAssignValueObject.TestAssignValueObject,
    },
    base : "base",
    keysInArray : ["type", "path", "putPath", "value", "param", "valuePath"],
  },
];
Utils.registerHierarchy(TestAssignValueHierarchy);

return TestAssignValueHierarchy;

});
