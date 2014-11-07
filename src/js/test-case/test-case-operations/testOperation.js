define([
  "ember",
  "lib/ember-utils-core",
], function(Ember) {

/**
 * Test Opertaion base class.
 *
 * @class EmberTests.TestCase.TestOperation
 * @submodule test-case-operation
 */
var TestOperation = Ember.Object.extend({
  run : function(testData) {
  },

  assertions : 0,
});

return {
  TestOperation : TestOperation,
};

});
