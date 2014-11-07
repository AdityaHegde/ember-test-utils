define([
  "ember",
  "lib/ember-utils-core",
  "./test-utils/main",
  "./test-case/main",
  "./mockjax-utils/main",
], function(Ember, Utils, TestUtils, TestCase, MockjaxUtils) {
  if(!Ember.isEmpty(window.QUnit)) {
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
  }
  var EmberTests = Ember.Namespace.create();
  EmberTests.TestUtils = TestUtils;
  EmberTests.TestCase = TestCase;
  EmberTests.MockjaxUtils = MockjaxUtils;

  window.EmberTests = EmberTests;

  return EmberTests;
});
