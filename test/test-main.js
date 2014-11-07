requirejs([
  "ember_qunit",
  "lib/ember-utils-core",
  "source/ember-test-utils",
  "test/test-app",
  "test/test-utils-tests/main",
  "test/test-case-tests/main",
  "test/mockjax-utils-tests",
], function(emq, Utils, EmberTests) {
  QUnit.config.reorder = false;
  QUnit.config.autostart = false;
  //workaroud for qunit not reporting toatal tests
  var testCount = 0;
  var qunitTest = QUnit.test;
  QUnit.test = window.test = function () {
    testCount += 1;
    qunitTest.apply(this, arguments);
  };
  QUnit.begin(function (args) {
    args.totalTests = testCount;
    EmberTests.TestUtils.equal = equal;
    EmberTests.TestUtils.ok = ok;
    EmberTests.TestUtils.wait = wait;
    EmberTests.TestUtils.andThen = andThen;
  });
  for(var i = 4; i < arguments.length; i++) {
    arguments[i]();
  }
  QUnit.load();
  QUnit.start();
});
