define([
  "ember",
  "lib/ember-utils-core",
], function(Ember) {

/**
 * Test Case Block. A block of operations run synchronously. They are preeceded by a wait() and enclosed in andThen().
 *
 * @class TestBlock
 */
var TestBlock = Ember.Object.extend({
  testOperations : Utils.hasManyWithHierarchy("TestCase.TestHierarchyMap", 2, "type"),

  run : function(testData) {
    var block = this;

    TestUtils.wait();
    TestUtils.andThen(function() {
      Ember.run(function() {
        var operations = block.get("testOperations");
        for(var i = 0; i < operations.length; i++) {
          operations[i].run(testData);
        }
      });
    });
  },

  //assertions : Ember.computed.sum("testOperations.@each.assertions"),
  assertions : function() {
    var assertions = 0, testOperations = this.get("testOperations");
    if(testOperations) {
      testOperations.forEach(function(oprn) {
        assertions += oprn.get("assertions");
      });
    }
    return assertions;
  }.property("testOperations.@each.assertions"),
});

return {
  TestBlock : TestBlock,
};

});
