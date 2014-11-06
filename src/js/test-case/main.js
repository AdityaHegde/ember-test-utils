/**
 * Module with misc methods.
 *
 * @module test-case
 */

define([
  "./testSuit",
  "./emberTestSuit",
  "./testCase",
  "./testBlock",
  "./test-case-operations/main",
  "./addToTestHierarchy",
], function() {
  var TestCase = Ember.Namespace.create();
  window.TestCase = TestCase;

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        TestCase[k] = arguments[i][k];
      }
    }
  }

  return TestCase;
});
