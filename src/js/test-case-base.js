/**
 * Test Case Helper module.
 *
 * @module test-case
 */
TestCase = Ember.Namespace.create();

/**
 * A simple test case suit class.
 *
 * @class TestCase.TestSuit
 */
TestCase.TestSuit = Ember.Object.extend({
  init : function() {
    this._super();
    this.modularize();
    var testCases = this.get("testCases");
    if(testCases) {
      for(var i = 0; i < testCases.length; i++) {
        testCases[i].register();
      }
    }
  },

  /**
   * Name of the test suit.
   *
   * @property suitName
   * @type String
   */
  suitName : "",

  /**
   * Options to be passed to the qunit module.
   *
   * @property moduleOpts
   * @type Object
   */
  moduleOpts : {},

  /**
   * Array of test cases. Will be automatically be converted to TestCase classes based on "testCase" attribute.
   *
   * @property testCases
   * @type Array
   */
  testCases : Utils.hasManyWithHierarchy("TestCase.TestHierarchyMap", 0, "type"),

  modularize : function() {
    module(this.get("suitName"), this.get("moduleOpts"));
  },
});

/**
 * Test suit which call moduleFor* module initializer provided by ember-qunit.
 *
 * @class TestCase.EmberTestSuit
 */
TestCase.EmberTestSuit = TestCase.TestSuit.extend({
  /**
   * Module initializer function. Can have moduleFor, moduleForComponent or moduleForModel.
   *
   * @property moduleFunction
   * @type String
   * @default "moduleFor"
   */
  moduleFunction : "moduleFor",

  /**
   * The 1st param passed to moduleFunction.
   *
   * @property param
   * @type String
   */
  param : "",

  modularize : function() {
    window[this.get("moduleFunction")](this.get("param"), this.get("suitName"), this.get("moduleOpts"));
  },
});

/**
 * Test Case class.
 *
 * @class TestCase.TestCase
 */
TestCase.TestCase = Ember.Object.extend({
  register : function() {
    var testCase = this;
    test(this.get("title"), function() {
      testCase.set("testData.testContext", this);
      testCase.run();
    });
  },

  /**
   * Title of the test case.
   *
   * @property title
   * @type String
   */
  title : "",

  /**
   * Object of data to be shared within test case.
   *
   * @property testData
   * @type Object
   */
  testData : Utils.belongsTo(),

  /**
   * Array of test blocks. Will be automatically be converted to TestBlock classes based on "block" attribute.
   *
   * @property testBlocks
   * @type Array
   */
  testBlocks : Utils.hasManyWithHierarchy("TestCase.TestHierarchyMap", 1, "type"),

  initialize : function() {
  },

  run : function() {
    this.initialize();
    var blocks = this.get("testBlocks");
    for(var i = 0; i < blocks.length; i++) {
      blocks[i].run(this.get("testData"));
    }
  },
});

TestCase.TestCaseMap = {
  "baseTestCase" : TestCase.TestCase,
};

/**
 * Test Case Block. A block of operations run synchronously. They are preeceded by a wait() and enclosed in andThen().
 *
 * @class TestCase.TestBlock
 */
TestCase.TestBlock = Ember.Object.extend({
  testOperations : Utils.hasManyWithHierarchy("TestCase.TestHierarchyMap", 2, "type"),

  run : function(testData) {
    var block = this;

    TestUtils.wait();
    TestUtils.andThen(function() {
      Ember.run(function() {
        var operations = block.get("testOperations");
        for(var i = 0; i < operations.length; i++) {
          operations[i].run(testData);
        }
      });
    });
  },
});

TestCase.TestBlocksMap = {
  "baseTestBlock" : TestCase.TestBlock,
};
