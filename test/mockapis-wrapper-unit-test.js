Utils.addToHierarchy(TestCase.TestHierarchyMap, "ajaxCall", TestCase.TestOperation.extend({
  run : function(testData) {
    var back, that = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      back = MockjaxUtils.MockjaxSettingsInstance;
      MockjaxUtils.MockjaxSettingsInstance = MockjaxUtils.MockjaxSettings.create(that.get("attr5"));
      $.ajax({
        url : "/"+that.get("attr1")+"/"+that.get("attr2"),
        type : that.get("attr3"),
        data : that.get("attr4"),
      }).then(function(data) {
        Ember.run(function() {
          testData.set("returnedData", data);
          MockjaxUtils.MockjaxSettingsInstance = back;
          resolve();
        });
      }, function(message) {
        Ember.run(function() {
          testData.set("failureMessage", message);
          MockjaxUtils.MockjaxSettingsInstance = back;
          resolve();
        });
      });
    });
  },
}), 2);

App.Testa = ModelWrapper.createModelWrapper({
  vara : attr(),
  varb : attr(),
}, {
  keys : ["vara"],
  apiName : "testa",
  queryParams : ["vara"],
});
MockjaxUtils.addMockjaxData({
  name : "testa",
  data : [{
    id : "vara1",
    vara : "vara1",
    varb : "varb1",
  }, {
    id : "vara2",
    vara : "vara2",
    varb : "varb2",
  }],
  modelClass : App.Testa,
  getAdditionalData : {
    varc : "get",
  },
  getAllAdditionalData : {
    varc : "getAll",
  },
  createUpdateAdditionalData : {
    varc : "createUpdate",
  },
});


TestCase.TestSuit.create({
  suitName : "mockjax-wrapper.js",
  testCases : [{
    title : "simple get",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "get", "GET", { vara : "vara1" }],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "returnedData.result", {
            data : {
              id : "vara1",
              vara : "vara1",
              varb : "varb1",
            },
            message: "Success",
            status: 0,
            varc: "get",
          }, "get call returned with appropriate values."],
        ]],
      ]],
    ],
  }, {
    title : "get with 500 server error.",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "get", "GET", { vara : "vara1" }, { throwServerError : true }],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "failureMessage.status",     500,            "get call returned with 500 error."],
          ["base", "failureMessage.statusText", "Server Error", "get call returned with 500 error with expected statusText."],
        ]],
      ]],
    ],
  }, {
    title : "get with overridden 404 error server error.",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "get", "GET", { vara : "vara1" }, { throwServerError : true, serverErrorCode : 404 }],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "failureMessage.status",     404,            "get call returned with 404 error."],
          ["base", "failureMessage.statusText", "Server Error", "get call returned with 404 error with expected statusText."],
        ]],
      ]],
    ],
  }, {
    title : "get with server processing error.",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "get", "GET", { vara : "vara1" }, { throwProcessError : 1 }],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "returnedData.result", {
            status : 1,
            message : "Failed",
          }, "Processing error returned appropriately."],
        ]],
      ]],
    ],
  }, {
    title : "simple getAll",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "getAll", "GET"],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "returnedData.result", {
            data : [{
              id : "vara1",
              vara : "vara1",
              varb : "varb1",
            }, {
              id : "vara2",
              vara : "vara2",
              varb : "varb2",
            }],
            message: "Success",
            status: 0,
            varc: "getAll",
          }, "getAll call returned with appropriate values."],
        ]],
      ]],
    ],
  }, {
    title : "simple create",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "create", "POST", { vara : "vara1", varb : "varb1" }],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "returnedData.result", {
            data : {
              id : "vara1",
              varc: "createUpdate",
            },
            message: "Success",
            status: 0,
          }, "create call returned with appropriate values."],
        ]],
      ]],
    ],
  }, {
    title : "create with 500 server error.",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "create", "POST", { vara : "vara1", varb : "varb1" }, { throwServerError : true }],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "failureMessage.status",     500,            "get call returned with 500 error."],
          ["base", "failureMessage.statusText", "Server Error", "get call returned with 500 error with expected statusText."],
        ]],
      ]],
    ],
  }, {
    title : "create with overridden 404 server error.",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "create", "POST", { vara : "vara1", varb : "varb1" }, { throwServerError : true, serverErrorCode : 404 }],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "failureMessage.status",     404,            "get call returned with 404 error."],
          ["base", "failureMessage.statusText", "Server Error", "get call returned with 404 error with expected statusText."],
        ]],
      ]],
    ],
  }, {
    title : "create with server processing error.",
    type : "baseTestCase",
    testData : {},
    testBlocks : [
      ["ajaxCall", "testa", "create", "POST", { vara : "vara1", varb : "varb1" }, { throwProcessError : 1 }],
      ["baseTestBlock", [
        ["checkValues", [
          //"type", "path", "value", "message"
          ["base", "returnedData.result", {
            status : 1,
            message : "Failed",
          }, "Processing error returned appropriately."],
        ]],
      ]],
    ],
  }],
});
