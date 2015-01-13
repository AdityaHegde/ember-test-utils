define([
  "ember",
  "./testOperation",
  "./testValueCheckHierarchy",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation, TestValueCheckHierarchy, Utils, TestUtils) {

/**
 * Test Operation to check a set of values.
 *
 * @class EmberTests.TestCase.TestValuesCheck
 * @extends EmberTests.TestCase.TestOperation
 * @submodule test-case-operation
 */
var TestValuesCheck = TestOperation.TestOperation.extend({
  values : Utils.hasManyWithHierarchy(TestValueCheckHierarchy, 0, "type"),

  run : function(testData) {
    var values = this.get("values");
    for(var i = 0; i < values.length; i++) {
      var path = values[i].get("path"),
          value = values[i].get("valuePath") ? 
                    TestUtils.getter(testData, values[i].get("valuePath"))[0] :
                    values[i].get("value"),
          message = values[i].get("message"),
          getValue = TestUtils.getter(testData, path);
      if(Ember.typeOf(value) === "object") {
        if(Ember.typeOf(getValue[0]) === "instance") {
          TestUtils.ok(TestUtils.deepCheck(getValue[0], value), message);
        }
        else {
          TestUtils.deepEqual(getValue[0], value, message);
        }
      }
      else if(Ember.typeOf(value) === "array") {
        TestUtils.ok(TestUtils.checkElements(getValue[1], getValue[2], value), message);
      }
      else if(Ember.typeOf(value) === "class") {
        TestUtils.ok(getValue[0] instanceof value, message);
      }
      else {
        TestUtils.equal(getValue[0], value, message);
      }
    }
  },

  attr1 : function(key, value) {
    if(arguments.length > 1) {
      this.set("values", value);
      return value;
    }
  }.property(),

  assertions : Ember.computed.alias("values.length"),
});

return {
  TestValuesCheck : TestValuesCheck,
};

});
