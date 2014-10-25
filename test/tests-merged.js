App = Ember.Application.create({
  rootElement : "#ember-testing",
});

App.setupForTesting();
App.injectTestHelpers();
setResolver(Ember.DefaultResolver.create({ namespace: App }));

module("getter");

test("Simple get value", function() {
  var obj = Ember.Object.create({
    vara : "a",
    varb : Ember.Object.create({
      varc : "c",
      vard : Ember.Object.create({
        vare : "e",
      }),
    }),
  });

  equal(TestUtils.getter(obj, "vara")[0], "a");
  equal(TestUtils.getter(obj, "varb.varc")[0], "c");
  equal(TestUtils.getter(obj, "varb.vard.vare")[0], "e");
});

test("Get on arrays", function() {
  var obj = Ember.Object.create({
    vara : "a",
    varb : [Ember.Object.create({
      varc : "c1",
    }), Ember.Object.create({
      varc : "c2",
      vard : Ember.Object.create({
        vare : "e",
      }),
    }), Ember.Object.create({
      varc : "c3",
    })],
    varf : ["a", "b", "c"],
  });

  equal(TestUtils.getter(obj, "varb.0.varc")[0], "c1");
  equal(TestUtils.getter(obj, "varb.1.varc")[0], "c2");
  equal(TestUtils.getter(obj, "varb.1.vard.vare")[0], "e");
  equal(TestUtils.getter(obj, "varb.[varc=c3].varc")[0], "c3");
  equal(TestUtils.getter(obj, "varf.1")[0], "b");
  equal(TestUtils.getter(obj, "varb.[varc=c2]")[0], obj.get("varb").objectAt(1));
});

module("setter");

test("Simple set value", function() {
  var obj = Ember.Object.create({
    vara : "a",
    varb : Ember.Object.create({
      varc : "c",
      vard : Ember.Object.create({
        vare : "e",
      }),
    }),
  });

  Ember.run(function() {
    TestUtils.setter(obj, "", "vara", "a1");
    TestUtils.setter(obj, "varb", "varc", "c1");
    TestUtils.setter(obj, "varb.vard", "vare", "e1");
  });

  equal(TestUtils.getter(obj, "vara")[0], "a1");
  equal(TestUtils.getter(obj, "varb.varc")[0], "c1");
  equal(TestUtils.getter(obj, "varb.vard.vare")[0], "e1");
});

test("Set on arrays", function() {
  var obj = Ember.Object.create({
    vara : "a",
    varb : [Ember.Object.create({
      varc : "c1",
    }), Ember.Object.create({
      varc : "c2",
      vard : Ember.Object.create({
        vare : "e",
      }),
    }), Ember.Object.create({
      varc : "c3",
    })],
  });

  Ember.run(function() {
    TestUtils.setter(obj, "varb.0", "varc", "c_1");
    TestUtils.setter(obj, "varb.1", "varc", "c_2");
    TestUtils.setter(obj, "varb.1.vard", "vare", "e1");
    TestUtils.setter(obj, "varb.[varc=c3]", "varc", "c_3");
  });

  equal(TestUtils.getter(obj, "varb.0.varc")[0], "c_1");
  equal(TestUtils.getter(obj, "varb.1.varc")[0], "c_2");
  equal(TestUtils.getter(obj, "varb.1.vard.vare")[0], "e1");
  equal(TestUtils.getter(obj, "varb.[varc=c_3].varc")[0], "c_3");
});

test("array modifiers", function() {
  var obj = Ember.Object.create({
    vara : ["a", "b", "c"],
  });

  Ember.run(function() {
    TestUtils.setter(obj, "vara", "", "", ["pop"]);
  });
  equal(obj.get("vara.length"), 2);

  Ember.run(function() {
    TestUtils.setter(obj, "vara", "", "d", ["push"]);
  });
  equal(TestUtils.getter(obj, "vara.2")[0], "d");
  equal(obj.get("vara.length"), 3);

  Ember.run(function() {
    TestUtils.setter(obj, "vara", "", "e", ["unshift"]);
  });
  equal(TestUtils.getter(obj, "vara.0")[0], "e");
  equal(obj.get("vara.length"), 4);

  Ember.run(function() {
    TestUtils.setter(obj, "vara", "", "", ["shift"]);
  });
  equal(TestUtils.getter(obj, "vara.0")[0], "a");
  equal(obj.get("vara.length"), 3);

  Ember.run(function() {
    TestUtils.setter(obj, "vara", "", "b", ["remove"]);
  });
  equal(TestUtils.getter(obj, "vara.1")[0], "d");
  equal(obj.get("vara.length"), 2);

  Ember.run(function() {
    TestUtils.setter(obj, "vara", "", "b", ["insertAt", 1]);
  });
  equal(TestUtils.getter(obj, "vara.1")[0], "b");
  equal(obj.get("vara.length"), 3);

  Ember.run(function() {
    TestUtils.setter(obj, "vara", "", "", ["removeAt", 1]);
  });
  equal(TestUtils.getter(obj, "vara.0")[0], "a");
  equal(obj.get("vara.length"), 2);
});

module("Check Unit Test");

test("TestUtils.checkElements", function() {
  var checks = [
    //src, path, check, exactCheck, output
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "d", "e"],
      true, true,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "d"],
      true, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "d", "e", "f"],
      true, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e", "d"],
      true, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e", "d"],
      false, true,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e", "f"],
      false, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e", "d", "f"],
      false, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e"],
      false, false,
    ],
  ];

  var objClass = Ember.Object.extend({
    arr : Utils.hasMany(),
  });
  for(var i = 0; i < checks.length; i++) {
    var obj = objClass.create({arr : checks[i][0]});
    equal(TestUtils.checkElements(obj.get("arr"), checks[i][1], checks[i][2], checks[i][3]), checks[i][4]);
  }
});

test("TestUtils.deepCheck", function() {
  var checks = [
    //srcObj, checkObj, output
    [
      {vara : "a", varb : "b"},
      {vara : "a", varb : "b"},
      true,
    ],
    [
      {vara : "a", varb : "b"},
      {vara : "a", varb : "c"},
      false,
    ],
    [
      {vara : "a", varb : "b", varc : "c"},
      {vara : "a", varb : "b"},
      true,
    ],
    [
      {vara : "a"},
      {vara : "a", varb : "b"},
      false,
    ],
    [
      {vara : "a", varb : [1, 2, 3]},
      {vara : "a", varb : [1, 2, 3]},
      true,
    ],
    [
      {vara : "a", varb : [1, 2, 3]},
      {vara : "a", varb : [1, 4, 3]},
      false,
    ],
    [
      {vara : "a", varb : [1, 2]},
      {vara : "a", varb : [1, 2, 3]},
      false,
    ],
    [
      {vara : "a", varb : [1, 2, 3, 4]},
      {vara : "a", varb : [1, 2, 3]},
      false,
    ],
    [
      {vara : "a", varb : [1, 2, 3], varc : {vard : "d"}},
      {vara : "a", varb : [1, 2, 3], varc : {vard : "d"}},
      true,
    ],
  ];

  for(var i = 0; i < checks.length; i++) {
    equal(TestUtils.deepCheck(checks[i][0], checks[i][1]), checks[i][2]);
  }
  for(var i = 0; i < checks.length; i++) {
    var obj = Ember.Object.create(checks[i][0]);
    equal(TestUtils.deepCheck(obj, checks[i][1]), checks[i][2]);
  }
});

module("Test Suit");

test("Simple Test Suit", function() {
  var moduleBack = window.module, returnedSuitName, returnedModuleOpts;
  window.module = function(suitName, moduleOpts) {
    returnedSuitName = suitName;
    returnedModuleOpts = moduleOpts;
  }

  var testSuit = TestCase.TestSuit.create({
    suitName : "Test",
    moduleOpts : {
      vara : "a",
      varb : "b",
    },
  });

  equal(returnedSuitName, "Test");
  deepEqual(returnedModuleOpts, {vara : "a", varb : "b"});

  window.module = moduleBack;
});

test("Ember Module Test Suit", function() {
  var moduleBack = window.moduleForComponent,
      returnedParam, returnedSuitName, returnedModuleOpts;
  window.moduleForComponent = function(param, suitName, moduleOpts) {
    returnedSuitName = suitName;
    returnedModuleOpts = moduleOpts;
    returnedParam = param;
  }

  var testSuit = TestCase.EmberTestSuit.create({
    suitName : "Test",
    moduleOpts : {
      vara : "a",
      varb : "b",
    },
    moduleFunction : "moduleForComponent",
    param : "testParam",
  });

  equal(returnedParam, "testParam");
  equal(returnedSuitName, "Test");
  deepEqual(returnedModuleOpts, {vara : "a", varb : "b"});

  window.moduleForComponent = moduleBack;
});

module("Test Case");

test("Sanity Test", function() {
  var testBack = window.test, returnedTestTitle, returnedTestFun;
  window.test = function(testTitle, testFun) {
    returnedTestTitle = testTitle;
    returnedTestFun = testFun;
  }

  var testCase = TestCase.TestCase.create({
    title : "Test",
    testData : {},
    testBlocks : [{
      type : "baseBlock",
    }],
    assertions : 1,
  });
  testCase.register();

  equal(returnedTestTitle, "Test");

  Ember.run(function() {
    returnedTestFun();
  });

  andThen(function() {
    window.test = testBack;
  });
});

test("New Class with inherited from TestCase", function() {
  var
  testBack = window.test, returnedTestTitle, returnedTestFun,
  initializeCalled = false, runOnBlockCalled = false,
  returnedTestData,
  testCaseClass = TestCase.TestCase.extend({
    initialize : function() {
      initializeCalled = true;
    },
    assertions : 4,
  }),
  testBlockClass = TestCase.TestBlock.extend({
    run : function(testData) {
      runOnBlockCalled = true;
      returnedTestData = testData;
    },
  });
  Utils.addToHierarchy(TestCase.TestHierarchyMap, "testTC", testCaseClass, 0)
  Utils.addToHierarchy(TestCase.TestHierarchyMap, "testBl", testBlockClass, 1)
  window.test = function(testTitle, testFun) {
    returnedTestTitle = testTitle;
    returnedTestFun = testFun;
  }

  var testCase = testCaseClass.create({
    title : "Test",
    testData : {
      vara : "VARA",
    },
    testBlocks : [{
      type : "testBl",
    }],
  });
  testCase.register();

  equal(returnedTestTitle, "Test");

  Ember.run(function() {
    returnedTestFun();
  });

  andThen(function() {
    ok(initializeCalled);
    ok(runOnBlockCalled);
    equal(returnedTestData.get("vara"), "VARA");
    window.test = testBack;
  });
});

module("Test Operations");

test("Values check operation", function() {
  var testBack = window.test, 
      okback = TestUtils.ok, equalback = TestUtils.equal,
      waitback = TestUtils.wait, andthenback = TestUtils.andThen,
      returnedTestTitle, returnedTestFun,
      oks = [], equals = [];
  window.test = function(testTitle, testFun) {
    returnedTestTitle = testTitle;
    returnedTestFun = testFun;
  }
  TestUtils.ok = function(bool, msg) {
    oks.push([bool, msg]);
  };
  TestUtils.equal = function(val1, val2, msg) {
    equals.push([val1, val2, msg]);
  };
  TestUtils.wait = function() {};
  TestUtils.andThen = function(fun) {
    fun();
  };

  var testCase = TestCase.TestCase.create({
    title : "Test",
    testData : {
      vara : "a",
      varb : "b",
      varc : "c",
      vard : "b1",
    },
    testBlocks : [
      ["checkValues", [
        //"type"    "path"    "value"   "message"   "valuePath"
        ["base",    "vara",   "a1",      "testa"],
        ["base",    "varb",   "",        "testb",   "vard"],
      ]],
    ],
  });
  testCase.register();

  returnedTestFun();

  equal(equals.length, 2);
  deepEqual( equals, [
    ["a", "a1", "testa"],
    ["b", "b1", "testb"]
  ]);

  window.test = testBack;
  TestUtils.ok = okback;
  TestUtils.equal = equalback;
  TestUtils.wait = waitback;
  TestUtils.andThen = andthenback;
});

test("Assign values operation", function() {
  var testBack = window.test, 
      waitback = TestUtils.wait, andthenback = TestUtils.andThen,
      returnedTestTitle, returnedTestFun;
  window.test = function(testTitle, testFun) {
    returnedTestTitle = testTitle;
    returnedTestFun = testFun;
  }
  TestUtils.wait = function() {};
  TestUtils.andThen = function(fun) {
    fun();
  };

  var testCase = TestCase.TestCase.create({
    title : "Test",
    testData : {
      vara : "a",
      varb : "b",
      varc : "c",
      vard : "d",
    },
    testBlocks : [
      ["assignValues", [
        //"type"    "path"    "putPath"   "value"   "param"   "valuePath"
        ["base",    "",       "vara",     "a1"],
        ["base",    "",       "varb",     "",       "",       "vard"],
      ]],
    ],
    assertions : 2,
  });
  testCase.register();

  returnedTestFun();

  var testData = testCase.get("testData");

  equal(testData.get("vara"), "a1");
  equal(testData.get("varb"), "d");

  window.test = testBack;
  TestUtils.wait = waitback;
  TestUtils.andThen = andthenback;
});

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
