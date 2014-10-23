/**
 * Test Operations submodule.
 *
 * @module test-case
 * @submodule test-case-operation
 */

/**
 * Test Opertaion base class.
 *
 * @class TestCase.TestOperation
 */
TestCase.TestOperation = Ember.Object.extend({
  run : function(testData) {
  },
});

/**
 * Test Operation to check a set of values.
 *
 * @class TestCase.TestValues
 */
TestCase.TestValuesCheck = Ember.Object.extend({
  values : Utils.hasManyWithHierarchy("TestCase.TestValueCheckHierarchy", 0, "type"),

  run : function(testData) {
    var values = this.get("values");
    for(var i = 0; i < values.length; i++) {
      var path = values[i].get("path"),
          value = values[i].get("valuePath") ? 
                    TestUtils.getter(testData, values[i].get("valuePath"))[0] :
                    values[i].get("value"),
          getValue = TestUtils.getter(testData, path);
      if(Ember.typeOf(value) === "object") {
        TestUtils.ok(hasAttrs(getValue[0], value), values[i].get("message"));
      }
      else if(Ember.typeOf(value) === "array") {
        TestUtils.checkElements(getValue[1], getValue[2], values);
      }
      else {
        TestUtils.equal(getValue[0], value, values[i].get("message"));
      }
    }
  },

  attr1 : function(key, value) {
    if(arguments.length > 1) {
      this.set("values", value);
      return value;
    }
  }.property(),
});

/**
 * Object that has config for checking a value.
 *
 * @class TestCase.TestValueCheckObject
 */
TestCase.TestValueCheckObject = Ember.Object.extend({
  /**
   * Path of the value to check. Can have indices also!
   *
   * @property path
   * @type String
   */
  path : "",

  /**
   * Value to check against.
   *
   * @property value
   * @type Number|Boolean|String|Object
   */
  value : "",

  /**
   * Path to get value from.
   *
   * @property value
   * @type String
   */
  valuePath : null,
  
  /**
   * Message to show when the assertion passes.
   *
   * @property message
   * @type String
   */
  message : "",
});

TestCase.TestValueCheckHierarchy = [
  {
    classes : {
      "base" : TestCase.TestValueCheckObject,
    },
    base : "base",
    keysInArray : ["type", "path", "value", "message", "valuePath"],
  },
];
Utils.registerHierarchy(TestCase.TestValueCheckHierarchy);


/**
 * Test Operation to check a set of values.
 *
 * @class TestCase.TestAssignValues
 */
TestCase.TestAssignValues = Ember.Object.extend({
  values : Utils.hasManyWithHierarchy("TestCase.TestValueAssignHierarchy", 0, "type"),

  run : function(testData) {
    var values = this.get("values");
    for(var i = 0; i < values.length; i++) {
      var path = values[i].get("path"),
          putPath = values[i].get("putPath"),
          value = values[i].get("valuePath") ? 
                    TestUtils.getter(testData, values[i].get("valuePath"))[0] :
                    values[i].get("value");
      TestUtils.setter(testData, path, putPath, value);
    }
  },

  attr1 : function(key, value) {
    if(arguments.length > 1) {
      this.set("values", value);
      return value;
    }
  }.property(),
});


/**
 * Object that has config for checking a value.
 *
 * @class TestCase.TestValueAssignObject
 */
TestCase.TestValueAssignObject = Ember.Object.extend({
  /**
   * Path of the value to assign to. Can have indices also!
   *
   * @property path
   * @type String
   */
  path : "",

  /**
   * Path within value gotten by path to assign to.
   *
   * @property putPath
   * @type String
   */
  putPath : "",

  /**
   * Value to assign.
   *
   * @property value
   * @type Number|Boolean|String|Object
   */
  value : "",

  /**
   * Path to get value from.
   *
   * @property value
   * @type String
   */
  valuePath : null,
  
  /**
   * Param used in various operations. 
   * For array operations, 0th element is operation, 1st element is additional param to operation.
   *
   * @property params
   * @type Array
   */
  param : [],
});

TestCase.TestValueAssignHierarchy = [
  {
    classes : {
      "base" : TestCase.TestValueAssignObject,
    },
    base : "base",
    keysInArray : ["type", "path", "putPath", "value", "param", "valuePath"],
  },
];
Utils.registerHierarchy(TestCase.TestValueAssignHierarchy);

TestCase.TestHierarchyMap = [
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
      "baseTestBlock" : TestCase.TestBlock,
    },
    base : "baseTestBlock",
    keysInArray : ["type", "attr1", "attr2", "attr3"],
    childrenKey : "testOperations",
  },
  {
    classes : {
      "baseOperation" : TestCase.TestOperation,
      "checkValues" : TestCase.TestValuesCheck,
      "assignValues" : TestCase.TestAssignValues,
    },
    base : "baseOperation",
    keysInArray : ["type", "attr1", "attr2", "attr3"],
  },
];
Utils.registerHierarchy(TestCase.TestHierarchyMap);
