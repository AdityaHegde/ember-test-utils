define([
  "ember",
  "./testOperation",
  "./testValueAssignHierarchy",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation, TestValueAssignHierarchy) {

/**
 * Test Operation to check a set of values.
 *
 * @class TestAssignValues
 */
TestAssignValues = TestOperation.TestOperation.extend({
  values : Utils.hasManyWithHierarchy(TestValueAssignHierarchy, 0, "type"),

  run : function(testData) {
    var values = this.get("values");
    for(var i = 0; i < values.length; i++) {
      var path = values[i].get("path"),
          putPath = values[i].get("putPath"),
          value = values[i].get("valuePath") ? 
                    TestUtils.getter(testData, values[i].get("valuePath"))[0] :
                    values[i].get("value");
      TestUtils.setter(testData, path, putPath, value, values[i].get("param"));
    }
  },

  attr1 : function(key, value) {
    if(arguments.length > 1) {
      this.set("values", value);
      return value;
    }
  }.property(),
});

return {
  TestAssignValues : TestAssignValues,
};

});
