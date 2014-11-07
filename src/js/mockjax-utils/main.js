/**
 * Wrapper to mock ajax request from CrudAdaptor module.
 *
 * @module mockjax-utils
 */

define([
  "./mockjaxData",
  "./mockjaxSettings",
  "./getDataForModelType",
  "./createUpdateDataForModelType",
], function() {
  var MockjaxUtils = Ember.Namespace.create();
  //window.MockjaxUtils = MockjaxUtils;

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        MockjaxUtils[k] = arguments[i][k];
      }
    }
  }

  MockjaxUtils.RESPONSE_TIME = 100;
  $.mockjaxSettings.responseTime = MockjaxUtils.RESPONSE_TIME;
  $.mockjaxSettings.logging = false;

  return MockjaxUtils;
});
