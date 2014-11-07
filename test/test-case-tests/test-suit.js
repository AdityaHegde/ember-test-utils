define([
  "ember",
  "source/ember-test-utils",
], function(Ember, EmberTests) {

return function() {

module("Test Suit");

test("Simple Test Suit", function() {
  var moduleBack = window.module, returnedSuitName, returnedModuleOpts;
  window.module = function(suitName, moduleOpts) {
    returnedSuitName = suitName;
    returnedModuleOpts = moduleOpts;
  }

  var testSuit = EmberTests.TestCase.TestSuit.create({
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

  var testSuit = EmberTests.TestCase.EmberTestSuit.create({
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

};

});
