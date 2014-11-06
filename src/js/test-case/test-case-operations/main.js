/**
 * Test Operations submodule.
 *
 * @module test-case
 * @submodule test-case-operation
 */

define([
  "./testOperation",
  "./testAssignValues",
  "./testValueAssignObject",
  "./testValueCheckObject",
  "./testValuesCheck",
  "./setupStore",
], function() {
  var operations = {};

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        operations[k] = arguments[i][k];
      }
    }
  }

  return operations;
});
