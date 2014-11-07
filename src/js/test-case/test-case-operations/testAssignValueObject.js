define([
  "ember",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember) {


/**
 * Object that has config for checking a value.
 *
 * @class EmberTests.TestCase.TestAssignValueObject
 * @submodule test-case-operation
 */
var TestAssignValueObject = Ember.Object.extend({
  /**
   * Path of the value to assign to. Can have indices also!
   *
   * @property path
   * @type String
   */
  path : "",

  /**
   * Path within value gotten by path to assign to.
   *
   * @property putPath
   * @type String
   */
  putPath : "",

  /**
   * Value to assign.
   *
   * @property value
   * @type Number|Boolean|String|Object
   */
  value : "",

  /**
   * Path to get value from.
   *
   * @property value
   * @type String
   */
  valuePath : null,
  
  /**
   * Param used in various operations. 
   * For array operations, 0th element is operation, 1st element is additional param to operation.
   *
   * @property params
   * @type Array
   */
  param : [],
});

return {
  TestAssignValueObject : TestAssignValueObject,
};

});
