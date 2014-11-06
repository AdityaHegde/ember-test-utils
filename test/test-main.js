requirejs([
  "ember_qunit",
  "lib/ember-utils-core",
  "test-app",
  "./test-utils-tests/main",
  "./test-case-tests/main",
  "./mockjax-utils-tests",
], function() {
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
    TestUtils.equal = equal;
    TestUtils.ok = ok;
    TestUtils.wait = wait;
    TestUtils.andThen = andThen;
  });
  for(var i = 3; i < arguments.length; i++) {
    arguments[i]();
  }
  QUnit.load();
  QUnit.start();
});
