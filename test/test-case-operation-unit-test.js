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
