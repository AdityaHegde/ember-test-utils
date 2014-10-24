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
