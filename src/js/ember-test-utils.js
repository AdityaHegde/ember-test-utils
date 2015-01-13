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
    QUnit.begin(function (args) {
      TestUtils.equal = equal;
      TestUtils.deepEqual = deepEqual;
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
