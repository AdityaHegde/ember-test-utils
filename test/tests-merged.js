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
  var moduleBack = window.module,
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

  window.module = moduleBack;
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
});

test("Assign values operation", function() {
  var testBack = window.test, 
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
  });
  testCase.register();

  returnedTestFun();

  var testData = testCase.get("testData");

  equal(testData.get("vara"), "a1");
  equal(testData.get("varb"), "d");

  window.test = testBack;
});
