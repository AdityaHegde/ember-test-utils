define([
  "ember",
  "./testSuit",
  "lib/ember-utils-core",
], function(Ember, TestSuit) {

/**
 * Test suit which call moduleFor* module initializer provided by ember-qunit.
 *
 * @class EmberTestSuit
 */
var EmberTestSuit = TestSuit.TestSuit.extend({
  /**
   * Module initializer function. Can have moduleFor, moduleForComponent or moduleForModel.
   *
   * @property moduleFunction
   * @type String
   * @default "moduleFor"
   */
  moduleFunction : "moduleFor",

  /**
   * The 1st param passed to moduleFunction.
   *
   * @property param
   * @type String
   */
  param : "",

  modularize : function() {
    window[this.get("moduleFunction")](this.get("param"), this.get("suitName"), this.get("moduleOpts"));
  },
});

return {
  EmberTestSuit : EmberTestSuit,
};

});
