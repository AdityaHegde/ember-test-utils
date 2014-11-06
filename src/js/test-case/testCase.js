define([
  "ember",
  "lib/ember-utils-core",
], function(Ember) {

/**
 * Test Case class.
 *
 * @class TestCase
 */
var TestCase = Ember.Object.extend({
  register : function() {
    var testCase = this;
    test(this.get("title"), function() {
      testCase.set("testData.testContext", this);
      testCase.run();
    });
  },

  /**
   * Title of the test case.
   *
   * @property title
   * @type String
   */
  title : "",

  /**
   * Object of data to be shared within test case.
   *
   * @property testData
   * @type Object
   */
  testData : Utils.belongsTo(),

  /**
   * Array of test blocks. Will be automatically be converted to TestBlock classes based on "block" attribute.
   *
   * @property testBlocks
   * @type Array
   */
  testBlocks : Utils.hasManyWithHierarchy("TestCase.TestHierarchyMap", 1, "type"),

  initialize : function() {
  },

  run : function() {
    expect(this.get("assertions"));
    this.initialize();
    var blocks = this.get("testBlocks");
    for(var i = 0; i < blocks.length; i++) {
      blocks[i].run(this.get("testData"));
    }
    wait();
  },

  //assertions : Ember.computed.sum("testBlocks.@each.assertions"),
  assertions : function() {
    var assertions = 0, testBlocks = this.get("testBlocks");
    if(testBlocks) {
      testBlocks.forEach(function(block) {
        assertions += block.get("assertions");
      });
    }
    return assertions;
  }.property("testBlocks.@each.assertions"),
});

return {
  TestCase : TestCase,
};

});
