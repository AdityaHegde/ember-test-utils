define([
  "ember",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember) {


/**
 * Object that has config for checking a value.
 *
 * @class TestValueCheckObject
 */
var TestValueCheckObject = Ember.Object.extend({
  /**
   * Path of the value to check. Can have indices also!
   *
   * @property path
   * @type String
   */
  path : "",

  /**
   * Value to check against.
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
   * Message to show when the assertion passes.
   *
   * @property message
   * @type String
   */
  message : "",
});

return {
  TestValueCheckObject : TestValueCheckObject,
};

});
