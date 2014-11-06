/**
 * Module with misc methods.
 *
 * @module test-utils
 */

define([
  "./checkElements",
  "./deepCheck",
  "./getCurDate",
  "./getter",
  "./setter",
  "./setupAppForTesting",
], function() {
  /**
   * @class TestUtils
   */
  var TestUtils = Ember.Namespace.create();
  window.TestUtils = TestUtils;

  //start after DS
  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        TestUtils[k] = arguments[i][k];
      }
    }
  }

  return TestUtils;
});
