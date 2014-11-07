define([
  "ember",
  "./testHierarchyMap",
  "lib/ember-utils-core",
], function(Ember, TestHierarchyMap) {

var typeToLevel = {
  testCase : 0,
  tc : 0,
  testBlock : 1,
  tb : 1,
  testOperation : 2,
  to : 2,
};

//TODO : find a way to document this.
/*
 * Add a class to the test hierarchy.
 *
 * @method EmberTests.TestCase.addToTestHierarchy
 * @param {String} key Key to use in the classes map in the hierarchy.
 * @param {Class} classObj Class object to be added to hierarchy.
 * @param {String} type Type of object. Used in determining level to add to. Can be testCase/tc/testBlock/tb/testOperation/to.
 */
function addToTestHierarchy(key, classObj, type) {
  Utils.addToHierarchy(TestHierarchyMap, key, classObj, typeToLevel[type]);
}

return {
  addToTestHierarchy : addToTestHierarchy,
  TestHierarchyMap : TestHierarchyMap,
};

});
