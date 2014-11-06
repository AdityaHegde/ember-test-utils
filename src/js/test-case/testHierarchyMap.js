define([
  "ember",
  "./testCase",
  "./testBlock",
  "./test-case-operations/testOperation",
  "./test-case-operations/testValuesCheck",
  "./test-case-operations/testAssignValues",
  "./test-case-operations/setupStore",
  "lib/ember-utils-core",
], function(Ember, TestCase, TestBlock, TestOperation, TestValuesCheck, TestAssignValues, SetupStore) {

var TestHierarchyMap = [
  {
    classes : {
      "baseTestCase" : TestCase.TestCase,
    },
    base : "baseTestCase",
    keysInArray : ["type", "title", "testBlocks", "testData"],
    childrenKey : "testBlocks",
  },
  {
    classes : {
      "baseTestBlock" : TestBlock.TestBlock,
    },
    base : "baseTestBlock",
    keysInArray : ["type", "testOperations", "attr1", "attr2", "attr3", "attr4", "attr5"],
    childrenKey : "testOperations",
  },
  {
    classes : {
      "baseOperation" : TestOperation.TestOperation,
      "checkValues" : TestValuesCheck.TestValuesCheck,
      "assignValues" : TestAssignValues.TestAssignValues,
      "setupStore" : SetupStore.SetupStore,
    },
    base : "baseOperation",
    keysInArray : ["type", "attr1", "attr2", "attr3", "attr4", "attr5"],
  },
];
Utils.registerHierarchy(TestHierarchyMap);

return TestHierarchyMap;

});
