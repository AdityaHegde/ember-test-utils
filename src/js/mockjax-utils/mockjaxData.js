define([
  "ember",
  "jquery_mockjax",
], function(Ember) {

/**
 * Model data used to process a call to the model.
 *
 * @class MockjaxData
 */
var MockjaxData = Ember.Object.extend({
  /**
   * Model name as seen by ember-data.
   *
   * @property name
   * @type String
   */
  name : "",

  /**
   * Array of fixture data for the model.
   *
   * @property data
   * @type Array
   */
  data : [],

  /**
   * Ember Data model class created using ModelWrapper.createModelWrapper.
   *
   * @property modelClass
   * @type Class
   */
  modelClass : null,

  /**
   * Additional data to be sent during a get call.
   *
   * @property getAdditionalData
   * @type Object
   */
  getAdditionalData : {},

  /**
   * Additional data to be sent during a getAll call.
   *
   * @property getAdditionalData
   * @type Object
   */
  getAllAdditionalData : {},

  /**
   * Additional data to be sent during a create/update call.
   *
   * @property getAdditionalData
   * @type Object
   */
  createUpdateAdditionalData : {},
});

/**
 * Method to add mockjax model data.
 *
 * @method addMockjaxData
 * @param {Object} mockjaxData Object which will be used to create MockjaxData instance.
 */
var MockjaxDataMap = {};
var addMockjaxData = function(mockjaxData) {
  MockjaxDataMap[mockjaxData.name] = MockjaxData.create(mockjaxData);
};

return {
  MockjaxData : MockjaxData,
  MockjaxDataMap : MockjaxDataMap,
  addMockjaxData : addMockjaxData,
};

});
