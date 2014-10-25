/**
 * Wrapper to mock ajax request from CrudAdaptor module.
 *
 * @module mockjax-utils
 */
MockjaxUtils = Ember.Namespace.create();
MockjaxUtils.RESPONSE_TIME = 100;
$.mockjaxSettings.responseTime = MockjaxUtils.RESPONSE_TIME;
$.mockjaxSettings.logging = false;

/**
 * Mockjax settings class.
 *
 * @class MockjaxUtils.MockjaxSettings
 */
MockjaxUtils.MockjaxSettings = Ember.Object.extend({
  init : function() {
    this._super();
    this.get("responseTime");
    this.get("logging");
  },

  /**
   * If set to true, all calls will throw server error with error code 'serverErrorCode'.
   *
   * @property throwServerError
   * @type Boolean
   * @default false
   */
  throwServerError : false,

  /**
   * Server error code to throw when 'throwServerError' is set to true.
   *
   * @property serverErrorCode
   * @type Number
   * @default 500
   */
  serverErrorCode : 500,

  /**
   * Setting to 1 is equivalent to throwing a error by server in processing request.
   *
   * @property throwProcessError
   * @type Number
   * @default 0
   */
  throwProcessError : 0,

  /**
   * A map to change the model settings used for the call.
   *
   * @property modelChangeMap
   * @type Object
   */
  modelChangeMap : {},

  /**
   * An object which contains data used in the last call. Has 'model', 'type' and 'params' from last call.
   *
   * @property lastPassedData
   * @readonly
   * @type Class
   */
  lastPassedData : Ember.Object.create(),

  /**
   * Response time to use. This is a jquerymockjax setting.
   *
   * @property responseTime
   * @type Number
   * @default 50
   */
  responseTime : function(key, val) {
    if(arguments.length > 1) {
      $.mockjaxSettings.responseTime = val || MockjaxUtils.RESPONSE_TIME;
    }
  }.property(),

  /**
   * If set to true, every call will be logged. This is a jquerymockjax setting.
   *
   * @property logging
   * @type Boolean
   * @default false
   */
  logging : function(key, val) {
    if(arguments.length > 1) {
      $.mockjaxSettings.logging = Ember.isEmpty(val) ? false : val;
    }
  }.property(),
});
MockjaxUtils.MockjaxSettingsInstance = MockjaxUtils.MockjaxSettings.create();

/**
 * Model data used to process a call to the model.
 *
 * @class MockjaxUtils.MockjaxData
 */
MockjaxUtils.MockjaxData = Ember.Object.extend({
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
 * @method MockjaxUtils.addMockjaxData
 * @param {Object} mockjaxData Object which will be used to create MockjaxUtils.MockjaxData instance.
 */
MockjaxUtils.addMockjaxData = function(mockjaxData) {
  MockjaxUtils.MockjaxDataMap[mockjaxData.name] = MockjaxUtils.MockjaxData.create(mockjaxData);
};
MockjaxUtils.MockjaxDataMap = {};


urlPartsExtractRegex = new RegExp("^/(.*)/(.*?)$");

MockjaxUtils.getDataForModelType = function(mockObj, settings, model, type) {
  if(MockjaxUtils.MockjaxSettingsInstance.get("throwServerError")) {
    mockObj.status = MockjaxUtils.MockjaxSettingsInstance.get("serverErrorCode");
    mockObj.statusText = "Server Error";
  }
  else {
    var retData = {
      result : {
        status : MockjaxUtils.MockjaxSettingsInstance.get("throwProcessError"),
        message : MockjaxUtils.MockjaxSettingsInstance.get("throwProcessError") ? "Failed" : "Success",
      }
    }, parts = settings.url.match(urlPartsExtractRegex),
    params = Ember.typeOf(settings.data) === "string" ? JSON.parse(settings.data.replace(/^data=/, "")) : settings.data;
    model = model || (parts && parts[1]);
    type = type || (parts && parts[2]);
    if(MockjaxUtils.MockjaxSettingsInstance.get("modelChangeMap")[model]) {
      model = MockjaxUtils.MockjaxSettingsInstance.get("modelChangeMap")[model];
    }
    MockjaxUtils.MockjaxSettingsInstance.lastPassedData = {
      model : model,
      type : type,
      params : params,
    };
    if(model && type && !MockjaxUtils.MockjaxSettingsInstance.get("throwProcessError")) {
      var modelData = MockjaxUtils.MockjaxDataMap[model];
      if(type === "getAll") {
        retData.result.data = modelData.get("data");
        Utils.merge(retData.result, modelData.get("getAllAdditionalData"));
      }
      else if(type === "get") {
        retData.result.data = modelData.get("data").findBy("id", CrudAdapter.getId(params, modelData.get("modelClass")));
        Utils.merge(retData.result, modelData.get("getAdditionalData"));
      }
      else if(type === "delete") {
        retData.result.data = {
          id : CrudAdapter.getId(params, modelData.get("modelClass")),
        };
      }
    }
    mockObj.responseText = retData;
  }
};
MockjaxUtils.createUpdateDataForModelType = function(mockObj, settings, model, type) {
  if(MockjaxUtils.MockjaxSettingsInstance.get("throwServerError")) {
    mockObj.status = MockjaxUtils.MockjaxSettingsInstance.get("serverErrorCode");
    mockObj.statusText = "Server Error";
  }
  else {
    var retData = {
      result : {
        status : MockjaxUtils.MockjaxSettingsInstance.get("throwProcessError"),
        message : MockjaxUtils.MockjaxSettingsInstance.get("throwProcessError") ? "Failed" : "Success",
      }
    }, parts = settings.url.match(urlPartsExtractRegex),
    params = Ember.typeOf(settings.data) === "string" ? JSON.parse(settings.data) : settings.data;
    model = model || (parts && parts[1]);
    type = type || (parts && parts[2]);
    if(MockjaxUtils.MockjaxSettingsInstance.get("modelChangeMap")[model]) {
      model = MockjaxUtils.MockjaxSettingsInstance.get("modelChangeMap")[model];
    }
    MockjaxUtils.MockjaxSettingsInstance.lastPassedData = {
      model : model,
      type : type,
      params : params,
    };
    if(model && type && !MockjaxUtils.MockjaxSettingsInstance.get("throwProcessError")) {
      var modelData = MockjaxUtils.MockjaxDataMap[model];
      retData.result.data = {
        id : CrudAdapter.getId(params, modelData.get("modelClass")) || "someid",
      };
      Utils.merge(retData.result.data, modelData.get("createUpdateAdditionalData"));
    }
    mockObj.responseText = retData;
  }
};

$.mockjax({
  url: /\/.*?\/.*?/,
  type : "GET",
  response : function(settings) {
    MockjaxUtils.getDataForModelType(this, settings);
  },
});

$.mockjax({
  url: /\/.*?\/.*?/,
  type : "POST",
  response : function(settings) {
    MockjaxUtils.createUpdateDataForModelType(this, settings);
  },
});
