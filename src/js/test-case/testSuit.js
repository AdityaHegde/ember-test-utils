define([
  "ember",
  "./testHierarchyMap",
  "lib/ember-utils-core",
], function(Ember, TestHierarchyMap) {

/**
 * A simple test case suit class.
 *
 * @class TestSuit
 */
var TestSuit = Ember.Object.extend({
  init : function() {
    this._super();
    this.modularize();
    var testCases = this.get("testCases");
    if(testCases) {
      for(var i = 0; i < testCases.length; i++) {
        testCases[i].register();
      }
    }
  },

  /**
   * Name of the test suit.
   *
   * @property suitName
   * @type String
   */
  suitName : "",

  /**
   * Options to be passed to the qunit module.
   *
   * @property moduleOpts
   * @type Object
   */
  moduleOpts : {},

  /**
   * Array of test cases. Will be automatically be converted to TestCase classes based on "testCase" attribute.
   *
   * @property testCases
   * @type Array
   */
  testCases : Utils.hasManyWithHierarchy(TestHierarchyMap, 0, "type"),

  modularize : function() {
    module(this.get("suitName"), this.get("moduleOpts"));
  },
});

return {
  TestSuit : TestSuit,
};

});
