define([
  "ember",
  "source/ember-test-utils",
], function(Ember, EmberTests) {

return function() {

module("Test Operations");

test("Values check operation", function() {
  var testBack = window.test, 
      okback = EmberTests.TestUtils.ok, equalback = EmberTests.TestUtils.equal,
      waitback = EmberTests.TestUtils.wait, andthenback = EmberTests.TestUtils.andThen,
      returnedTestTitle, returnedTestFun,
      oks = [], equals = [];
  window.test = function(testTitle, testFun) {
    returnedTestTitle = testTitle;
    returnedTestFun = testFun;
  }
  EmberTests.TestUtils.ok = function(bool, msg) {
    oks.push([bool, msg]);
  };
  EmberTests.TestUtils.equal = function(val1, val2, msg) {
    equals.push([val1, val2, msg]);
  };
  EmberTests.TestUtils.wait = function() {};
  EmberTests.TestUtils.andThen = function(fun) {
    fun();
  };

  var testCase = EmberTests.TestCase.TestCase.create({
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
  EmberTests.TestUtils.ok = okback;
  EmberTests.TestUtils.equal = equalback;
  EmberTests.TestUtils.wait = waitback;
  EmberTests.TestUtils.andThen = andthenback;
});

test("Assign values operation", function() {
  var testBack = window.test, 
      waitback = EmberTests.TestUtils.wait, andthenback = EmberTests.TestUtils.andThen,
      returnedTestTitle, returnedTestFun;
  window.test = function(testTitle, testFun) {
    returnedTestTitle = testTitle;
    returnedTestFun = testFun;
  }
  EmberTests.TestUtils.wait = function() {};
  EmberTests.TestUtils.andThen = function(fun) {
    fun();
  };

  var testCase = EmberTests.TestCase.TestCase.create({
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
  EmberTests.TestUtils.wait = waitback;
  EmberTests.TestUtils.andThen = andthenback;
});

};

});
