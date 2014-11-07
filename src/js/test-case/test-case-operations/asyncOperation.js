define([
  "ember",
  "./testOperation",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation, Utils, TestUtils) {

Ember.Test.registerAsyncHelper("asyncOprnWrapper", function(app, context, callback, testData) {
  return callback.call(context, testData);
});
/**
 * Test Operation base class for async operations. Override asyncRun.
 *
 * @class EmberTests.TestCase.AsyncOperation
 * @extends EmberTests.TestCase.TestOperation
 * @module test-case
 * @submodule test-case-operation
 */
var AsyncOperation = TestOperation.TestOperation.extend({
  run : function(testData) {
    asyncOprnWrapper(this, this.get("asyncRun"), testData);
  },

  /**
   * Method called from inside a async test helper.
   *
   * @method asyncRun
   * @returns {Class} A promise object.
   */
  asyncRun : function(testData) {
    return new Ember.RSVP.promise(function(resolve, reject) {
      resolve();
    });
  },
});

return {
  AsyncOperation : AsyncOperation,
};

});
