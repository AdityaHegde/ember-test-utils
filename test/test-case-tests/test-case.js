define([
  "ember",
  "source/ember-test-utils",
], function(Ember, EmberTests) {

return function() {

module("Test Case");

test("Sanity Test", function() {
  var testBack = window.test, returnedTestTitle, returnedTestFun;
  window.test = function(testTitle, testFun) {
    returnedTestTitle = testTitle;
    returnedTestFun = testFun;
  }

  var testCase = EmberTests.TestCase.TestCase.create({
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
  testCaseClass = EmberTests.TestCase.TestCase.extend({
    initialize : function() {
      initializeCalled = true;
    },
    assertions : 4,
  }),
  testBlockClass = EmberTests.TestCase.TestBlock.extend({
    run : function(testData) {
      runOnBlockCalled = true;
      returnedTestData = testData;
    },
  });
  EmberTests.TestCase.addToTestHierarchy("testTC", testCaseClass, "tc")
  EmberTests.TestCase.addToTestHierarchy("testBl", testBlockClass, "tb")
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

};

});
