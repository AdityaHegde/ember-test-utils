//Markup needed for testing
//TODO : find a way to add thru karma config
$("body").append("" +
  "<div id='qunit-main-container'>" +
    "<h1 id='qunit-header'>Tests</h1>" +
    "<h2 id='qunit-banner'></h2>" +
    "<div id='qunit-testrunner-toolbar'></div>" +
    "<h2 id='qunit-userAgent'></h2>" +
    "<ol id='qunit-tests'></ol>" +
    "<div id='qunit-fixture'></div>" +
  "</div>" +
  "<div id='ember-testing'></div>" +
"");

var attr = DS.attr, hasMany = DS.hasMany, belongsTo = DS.belongsTo;

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

emq.globalize();
