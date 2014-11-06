define([
  "ember",
  "./mockjaxSettings",
  "./mockjaxData",
  "jquery_mockjax",
  "lib/ember-utils-core",
], function(Ember, MockjaxSettings, MockjaxData) {
MockjaxSettings = MockjaxSettings.MockjaxSettings;

urlPartsExtractRegex = new RegExp("^/(.*)/(.*?)$");

var getDataForModelType = function(mockObj, settings, model, type) {
  if(MockjaxSettings.MockjaxSettingsInstance.get("throwServerError")) {
    mockObj.status = MockjaxSettings.MockjaxSettingsInstance.get("serverErrorCode");
    mockObj.statusText = "Server Error";
  }
  else {
    var retData = {
      result : {
        status : MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError"),
        message : MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError") ? "Failed" : "Success",
      }
    }, parts = settings.url.match(urlPartsExtractRegex),
    params = Ember.typeOf(settings.data) === "string" ? JSON.parse(settings.data.replace(/^data=/, "")) : settings.data;
    model = model || (parts && parts[1]);
    type = type || (parts && parts[2]);
    if(MockjaxSettings.MockjaxSettingsInstance.get("modelChangeMap")[model]) {
      model = MockjaxSettings.MockjaxSettingsInstance.get("modelChangeMap")[model];
    }
    MockjaxSettings.MockjaxSettingsInstance.lastPassedData = {
      model : model,
      type : type,
      params : params,
    };
    if(model && type && !MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError")) {
      var modelData = MockjaxData.MockjaxDataMap[model];
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

$.mockjax({
  url: /\/.*?\/.*?/,
  type : "GET",
  response : function(settings) {
    getDataForModelType(this, settings);
  },
});

return {
  getDataForModelType : getDataForModelType,
};

});
