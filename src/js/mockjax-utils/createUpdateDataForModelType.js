define([
  "ember",
  "./mockjaxSettings",
  "./mockjaxData",
  "jquery_mockjax",
  "lib/ember-utils-core",
], function(Ember, MockjaxSettings, MockjaxData) {
MockjaxSettings = MockjaxSettings.MockjaxSettings;

urlPartsExtractRegex = new RegExp("^/(.*)/(.*?)$");

var createUpdateDataForModelType = function(mockObj, settings, model, type) {
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
    params = Ember.typeOf(settings.data) === "string" ? JSON.parse(settings.data) : settings.data;
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
  type : "POST",
  response : function(settings) {
    createUpdateDataForModelType(this, settings);
  },
});

return {
  createUpdateDataForModelType : createUpdateDataForModelType,
};

});
