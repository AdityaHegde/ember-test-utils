(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    root.EmberTests = factory(root.$);
  }
}(this, function($) {
define('test-utils/checkElements',[
  "ember",
], function(Ember) {

/**
 * Check a list of elements in an array.
 *
 * @method checkElements
 * @static
 * @param {Array} array The array to check in.
 * @param {String} path The path in array to compare to.
 * @param {Array} expected The array of expected values to be present in array.
 * @param {Boolean} [exactCheck=false] Checks the exact position of elements in expected in array if true.
 * @returns {Boolean} Returns true if the check passes, else false.
 */
function checkElements(array, path, expected, exactCheck) {
  if(array.get("length") !== expected.length) {
    return false;
  }
  for(var i = 0; i < expected.length; i++) {
    if(exactCheck) {
      var arrayObj = array.objectAt(i);
      if(arrayObj.get(path) !== expected[i]) {
        return false;
      }
    }
    else {
      var found = array.findBy(path, expected[i]);
      if(!found) {
        return false;
      }
    }
  }
  return true;
}

return {
  checkElements : checkElements,
};

});

define('test-utils/deepCheck',[
  "ember",
], function(Ember) {

/**
 * Deep check an object. Doesnt fail if objSrc has more keys that objCheck in case of object but checks for array length equivalance.
 *
 * @method deepCheck
 * @static
 * @param {any} objSrc The object to check in.
 * @param {any} objCheck The object to check with.
 * @returns {Boolean} Returns true if the check passes, else false.
 */
function deepCheck(objSrc, objCheck) {
  if(Ember.isEmpty(objSrc)) {
    return false;
  }
  if(Ember.typeOf(objCheck) === "object") {
    for(var k in objCheck) {
      var val = objSrc.get ? objSrc.get(k) : objSrc[k];
      if(Ember.isEmpty(val) || !deepCheck(val, objCheck[k])) {
        return false;
      }
    }
  }
  else if(Ember.typeOf(objCheck) === "array") {
    if(objCheck.length !== (objSrc.get ? objSrc.get("length") : objSrc.length)) {
      return false;
    }
    for(var i = 0; i < objCheck.length; i++) {
      var val = objSrc.objectAt ? objSrc.objectAt(i) : objSrc[i];
      if(Ember.isEmpty(val) || !deepCheck(val, objCheck[i])) {
        return false;
      }
    }
  }
  else {
    return objSrc === objCheck;
  }
  return true;
}

return {
  deepCheck : deepCheck,
};

});

define('test-utils/getCurDate',[
], function() {

/**
 * Get current date with offset.
 *
 * @method getCurDate
 * @static
 * @param {Number} [offset] Offset from current date. Can be negative.
 * @returns {Date} Returns local date + time.
 */
function getCurDate(offset) {
  var d = new Date();
  if(offset) {
    d = new Date(d.getTime() + offset*1000);
  }
  return d.toLocaleDateString()+" "+d.toTimeString();
}

return {
  getCurDate : getCurDate,
};

});

define('test-utils/getter',[
  "ember",
], function(Ember) {

/**
 * Advanced getter with a few extra features.
 * Use .i. to get into indiex i.
 * Use [a=b] to run findBy(a, b).
 *
 * @method getter
 * @static
 * @param {Class} obj Object to get from.
 * @param {String} path Path to get from.
 * @return {Array} Returns an array with [value, lastObj extracted, last part of path]
 */
function getter(obj, path) {
  var parts = path.split(/\.(?:\d+|@|\[.*?\])\./),
      directives = path.match(/\b(\d+|@|\.\[.*?\]\.?)(?:\b|$)/g),
      ret = obj, lastobj, i;
  if(parts.length > 0) {
    parts[parts.length - 1] = parts[parts.length - 1].replace(/\.(?:\d+|@|\[.*?\])$/, "");
  }
  if(parts.length > 1) {
    parts[0] = parts[0].replace(/\.(?:\d+|@|\[.*?\])$/, "");
  }
  for(i = 0; i < parts.length; i++) {
    if(!ret) return ret;
    lastobj = ret;
    ret = ret.get(parts[i]);
    if(directives && directives[i]) {
      var matches, idx = Number(directives[i]);
      if(idx === 0 || !!idx) {
        if(ret.objectAt) {
          ret = ret.objectAt(directives[i]);
        }
        else {
          return null;
        }
      }
      else if((matches = directives[i].match(/^\.\[(.*?)(?:=(.*?))?\]\.?$/))) {
        if(ret.findBy) {
          ret = ret.findBy(matches[1], matches[2]);
        }
        else {
          return null;
        }
      }
      else {
        return null;
      }
    }
  }
  return [ret, lastobj, parts[i - 1]];
}

return {
  getter : getter,
};

});

define('test-utils/setter',[
  "ember",
  "./getter",
], function(Ember, getter) {
getter = getter.getter;

/**
 * Advanced setter with call to TestUtils.getter
 *
 * @method setter
 * @static
 * @param {Class} obj Object to put to.
 * @param {String} path Path to object at the last part. If the last object is array, array modification is fired.
 * @param {String} putPath Path to put to at the object at last part. In case of array modification like push putPath will be an array with 0th element as the operation (allowed - push, pop, unshift, shift, remove, insertAt, removeAt) and 1st element as the index.
 * @param {any} value Value to put.
 */
function setter(obj, path, putPath, value, param) {
  var getVal = getter(obj, path);
  if(getVal && getVal[0]) {
    if(Ember.typeOf(getVal[0]) === "array" || Ember.typeOf(getVal[0].get("length")) === "number") {
      switch(param) {
        case "push" :
          getVal[0].pushObject(value);
          break;

        case "pop" :
          getVal[0].popObject();
          break;

        case "unshift" :
          getVal[0].unshiftObject(value);
          break;

        case "shift" :
          getVal[0].shiftObject();
          break;

        case "remove" :
          getVal[0].removeObject(value);
          break;

        case "insertAt" :
          getVal[0].insertAt(putPath, value);
          break;

        case "removeAt" :
          getVal[0].removeAt(putPath);
          break;

        case "addToProp" :
          getVal[0].addToProp(putPath, value);
          break;

        default: break;
      }
    }
    else {
      getVal[0].set(putPath, value);
    }
  }
}

return {
  setter : setter,
};

});

define('test-utils/setupAppForTesting',[
  "ember",
], function(Ember) {

/**
 * Setup app to start emmiting events without passing advance readinies to save time. Also registers a few views missing by default (bug?).
 *
 * @method setupAppForTesting
 * @static
 * @param {Class} app App object.
 * @param {Class} container Container object.
 */
function setupAppForTesting(app, container) {
  Ember.run(function() {
    app.setupEventDispatcher();
    app.resolve(app);
    container.register('view:select', Ember.Select);
    container.register('view:checkbox', Ember.Checkbox);
  });
}

return {
  setupAppForTesting : setupAppForTesting,
};

});

/**
 * Module with misc methods.
 *
 * @module test-utils
 */

define('test-utils/main',[
  "./checkElements",
  "./deepCheck",
  "./getCurDate",
  "./getter",
  "./setter",
  "./setupAppForTesting",
], function() {
  /**
   * @class EmberTests.TestUtils
   */
  var TestUtils = Ember.Namespace.create();
  //window.TestUtils = TestUtils;

  //start after DS
  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        TestUtils[k] = arguments[i][k];
      }
    }
  }

  return TestUtils;
});

define('test-case/testCase',[
  "ember",
  "lib/ember-utils-core",
], function(Ember, Utils) {

/**
 * Test Case class.
 *
 * @class EmberTests.TestCase.TestCase
 */
var TestCase = Ember.Object.extend({
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
  testBlocks : Utils.hasManyWithHierarchy("EmberTests.TestCase.TestHierarchyMap", 1, "type"),

  initialize : function() {
  },

  run : function() {
    expect(this.get("assertions"));
    this.initialize();
    var blocks = this.get("testBlocks");
    for(var i = 0; i < blocks.length; i++) {
      blocks[i].run(this.get("testData"));
    }
    wait();
  },

  //assertions : Ember.computed.sum("testBlocks.@each.assertions"),
  assertions : function() {
    var assertions = 0, testBlocks = this.get("testBlocks");
    if(testBlocks) {
      testBlocks.forEach(function(block) {
        assertions += block.get("assertions");
      });
    }
    return assertions;
  }.property("testBlocks.@each.assertions"),
});

return {
  TestCase : TestCase,
};

});

define('test-case/testBlock',[
  "ember",
  "lib/ember-utils-core",
  "../test-utils/main",
], function(Ember, Utils, TestUtils) {

/**
 * Test Case Block. A block of operations run synchronously. They are preeceded by a wait() and enclosed in andThen().
 *
 * @class EmberTests.TestCase.TestBlock
 */
var TestBlock = Ember.Object.extend({
  testOperations : Utils.hasManyWithHierarchy("EmberTests.TestCase.TestHierarchyMap", 2, "type"),

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

  //assertions : Ember.computed.sum("testOperations.@each.assertions"),
  assertions : function() {
    var assertions = 0, testOperations = this.get("testOperations");
    if(testOperations) {
      testOperations.forEach(function(oprn) {
        assertions += oprn.get("assertions");
      });
    }
    return assertions;
  }.property("testOperations.@each.assertions"),
});

return {
  TestBlock : TestBlock,
};

});

define('test-case/test-case-operations/testOperation',[
  "ember",
  "lib/ember-utils-core",
], function(Ember) {

/**
 * Test Opertaion base class.
 *
 * @class EmberTests.TestCase.TestOperation
 * @submodule test-case-operation
 */
var TestOperation = Ember.Object.extend({
  run : function(testData) {
  },

  assertions : 0,
});

return {
  TestOperation : TestOperation,
};

});

define('test-case/test-case-operations/testValueCheckObject',[
  "ember",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember) {


/**
 * Object that has config for checking a value.
 *
 * @class EmberTests.TestCase.TestValueCheckObject
 * @submodule test-case-operation
 */
var TestValueCheckObject = Ember.Object.extend({
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

return {
  TestValueCheckObject : TestValueCheckObject,
};

});

define('test-case/test-case-operations/testValueCheckHierarchy',[
  "ember",
  "./testValueCheckObject",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestValueCheckObject) {

var TestValueCheckHierarchy = [
  {
    classes : {
      "base" : TestValueCheckObject.TestValueCheckObject,
    },
    base : "base",
    keysInArray : ["type", "path", "value", "message", "valuePath"],
  },
];
Utils.registerHierarchy(TestValueCheckHierarchy);

return TestValueCheckHierarchy;

});

define('test-case/test-case-operations/testValuesCheck',[
  "ember",
  "./testOperation",
  "./testValueCheckHierarchy",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation, TestValueCheckHierarchy, Utils, TestUtils) {

/**
 * Test Operation to check a set of values.
 *
 * @class EmberTests.TestCase.TestValuesCheck
 * @extends EmberTests.TestCase.TestOperation
 * @submodule test-case-operation
 */
var TestValuesCheck = TestOperation.TestOperation.extend({
  values : Utils.hasManyWithHierarchy(TestValueCheckHierarchy, 0, "type"),

  run : function(testData) {
    var values = this.get("values");
    for(var i = 0; i < values.length; i++) {
      var path = values[i].get("path"),
          value = values[i].get("valuePath") ? 
                    TestUtils.getter(testData, values[i].get("valuePath"))[0] :
                    values[i].get("value"),
          message = values[i].get("message"),
          getValue = TestUtils.getter(testData, path);
      if(Ember.typeOf(value) === "object") {
        TestUtils.ok(TestUtils.deepCheck(getValue[0], value), message);
      }
      else if(Ember.typeOf(value) === "array") {
        TestUtils.ok(TestUtils.checkElements(getValue[1], getValue[2], value), message);
      }
      else if(Ember.typeOf(value) === "class") {
        TestUtils.ok(getValue[0] instanceof value, message);
      }
      else {
        TestUtils.equal(getValue[0], value, message);
      }
    }
  },

  attr1 : function(key, value) {
    if(arguments.length > 1) {
      this.set("values", value);
      return value;
    }
  }.property(),

  assertions : Ember.computed.alias("values.length"),
});

return {
  TestValuesCheck : TestValuesCheck,
};

});

define('test-case/test-case-operations/testAssignValueObject',[
  "ember",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember) {


/**
 * Object that has config for checking a value.
 *
 * @class EmberTests.TestCase.TestAssignValueObject
 * @submodule test-case-operation
 */
var TestAssignValueObject = Ember.Object.extend({
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

return {
  TestAssignValueObject : TestAssignValueObject,
};

});

define('test-case/test-case-operations/testAssignValueHierarchy',[
  "ember",
  "./testAssignValueObject",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestAssignValueObject) {

var TestAssignValueHierarchy = [
  {
    classes : {
      "base" : TestAssignValueObject.TestAssignValueObject,
    },
    base : "base",
    keysInArray : ["type", "path", "putPath", "value", "param", "valuePath"],
  },
];
Utils.registerHierarchy(TestAssignValueHierarchy);

return TestAssignValueHierarchy;

});

define('test-case/test-case-operations/testAssignValues',[
  "ember",
  "./testOperation",
  "./testAssignValueHierarchy",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation, TestAssignValueHierarchy, Utils, TestUtils) {

/**
 * Test Operation to check a set of values.
 *
 * @class EmberTests.TestCase.TestAssignValues
 * @extends EmberTests.TestCase.TestOperation
 * @submodule test-case-operation
 */
TestAssignValues = TestOperation.TestOperation.extend({
  values : Utils.hasManyWithHierarchy(TestAssignValueHierarchy, 0, "type"),

  run : function(testData) {
    var values = this.get("values");
    for(var i = 0; i < values.length; i++) {
      var path = values[i].get("path"),
          putPath = values[i].get("putPath"),
          value = values[i].get("valuePath") ? 
                    TestUtils.getter(testData, values[i].get("valuePath"))[0] :
                    values[i].get("value");
      TestUtils.setter(testData, path, putPath, value, values[i].get("param"));
    }
  },

  attr1 : function(key, value) {
    if(arguments.length > 1) {
      this.set("values", value);
      return value;
    }
  }.property(),
});

return {
  TestAssignValues : TestAssignValues,
};

});

define('test-case/test-case-operations/setupStore',[
  "ember",
  "./testOperation",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation) {

/**
 * Test Operation to setup ember data store.
 *
 * @class EmberTests.TestCase.SetupStore
 * @extends EmberTests.TestCase.TestOperation
 * @submodule test-case-operation
 */
var SetupStore = TestOperation.TestOperation.extend({
  run : function(testData) {
    var testContext = testData.get("testContext"),
        container = (testContext.get ? testContext.get("container") : testContext.container),
        store;
    if(testContext.store) {
      store = testContext.store();
      container = store.container;
    }
    else if (DS._setupContainer) {
      DS._setupContainer(container);
    }
    else {
      container.register('store:main', DS.Store);
    }

    container.register('adapter:application', testData.get("ApplicationAdapter"));
    container.register('serializer:application', testData.get("ApplicationSerializer"));

    testData.set("store", container.lookup('store:main'));
  },
});

return {
  SetupStore : SetupStore,
};

});

define('test-case/testHierarchyMap',[
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

define('test-case/testSuit',[
  "ember",
  "./testHierarchyMap",
  "lib/ember-utils-core",
], function(Ember, TestHierarchyMap) {

/**
 * A simple test case suit class.
 *
 * @class EmberTests.TestCase.TestSuit
 */
var TestSuit = Ember.Object.extend({
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
  testCases : Utils.hasManyWithHierarchy(TestHierarchyMap, 0, "type"),

  modularize : function() {
    module(this.get("suitName"), this.get("moduleOpts"));
  },
});

return {
  TestSuit : TestSuit,
};

});

define('test-case/emberTestSuit',[
  "ember",
  "./testSuit",
  "lib/ember-utils-core",
], function(Ember, TestSuit) {

/**
 * Test suit which call moduleFor* module initializer provided by ember-qunit.
 *
 * @class EmberTests.TestCase.EmberTestSuit
 * @extends EmberTests.TestCase.TestSuit
 */
var EmberTestSuit = TestSuit.TestSuit.extend({
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

return {
  EmberTestSuit : EmberTestSuit,
};

});

define('test-case/test-case-operations/asyncOperation',[
  "ember",
  "./testOperation",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation, Utils, TestUtils) {

Ember.Test.registerAsyncHelper("asyncOprnWrapper", function(app, context, callback, testData) {
  return callback.call(context, testData);
});
/**
 * Test Operation base class for async operations. Override asyncRun.
 *
 * @class EmberTests.TestCase.AsyncOperation
 * @extends EmberTests.TestCase.TestOperation
 * @module test-case
 * @submodule test-case-operation
 */
var AsyncOperation = TestOperation.TestOperation.extend({
  run : function(testData) {
    asyncOprnWrapper(this, this.get("asyncRun"), testData);
  },

  /**
   * Method called from inside a async test helper.
   *
   * @method asyncRun
   * @returns {Class} A promise object.
   */
  asyncRun : function(testData) {
    return new Ember.RSVP.promise(function(resolve, reject) {
      resolve();
    });
  },
});

return {
  AsyncOperation : AsyncOperation,
};

});

/**
 * Test Operations submodule.
 *
 * @module test-case
 * @submodule test-case-operation
 */

define('test-case/test-case-operations/main',[
  "./testOperation",
  "./testAssignValues",
  "./testAssignValueObject",
  "./testValueCheckObject",
  "./testValuesCheck",
  "./setupStore",
  "./asyncOperation",
], function() {
  var operations = {};

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        operations[k] = arguments[i][k];
      }
    }
  }

  return operations;
});

define('test-case/addToTestHierarchy',[
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

/**
 * Module with classes for building a test suit.
 *
 * @module test-case
 */

define('test-case/main',[
  "./testSuit",
  "./emberTestSuit",
  "./testCase",
  "./testBlock",
  "./test-case-operations/main",
  "./addToTestHierarchy",
], function() {
  var TestCase = Ember.Namespace.create();
  //window.TestCase = TestCase;

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        TestCase[k] = arguments[i][k];
      }
    }
  }

  return TestCase;
});

define('mockjax-utils/mockjaxData',[
  "ember",
  "jquery_mockjax",
], function(Ember) {

/**
 * Model data used to process a call to the model.
 *
 * @class EmberTests.MockjaxUtilsMockjaxData
 */
var MockjaxData = Ember.Object.extend({
  /**
   * Model name as seen by ember-data.
   *
   * @property name
   * @type String
   */
  name : "",

  /**
   * Array of fixture data for the model.
   *
   * @property data
   * @type Array
   */
  data : [],

  /**
   * Ember Data model class created using ModelWrapper.createModelWrapper.
   *
   * @property modelClass
   * @type Class
   */
  modelClass : null,

  /**
   * Additional data to be sent during a get call.
   *
   * @property getAdditionalData
   * @type Object
   */
  getAdditionalData : {},

  /**
   * Additional data to be sent during a getAll call.
   *
   * @property getAdditionalData
   * @type Object
   */
  getAllAdditionalData : {},

  /**
   * Additional data to be sent during a create/update call.
   *
   * @property getAdditionalData
   * @type Object
   */
  createUpdateAdditionalData : {},
});

/**
 * Method to add mockjax model data.
 *
 * @method addMockjaxData
 * @param {Object} mockjaxData Object which will be used to create MockjaxData instance.
 */
var MockjaxDataMap = {};
var addMockjaxData = function(mockjaxData) {
  MockjaxDataMap[mockjaxData.name] = MockjaxData.create(mockjaxData);
};

return {
  MockjaxData : MockjaxData,
  MockjaxDataMap : MockjaxDataMap,
  addMockjaxData : addMockjaxData,
};

});

define('mockjax-utils/mockjaxSettings',[
  "ember",
  "jquery_mockjax",
], function(Ember) {

/**
 * Mockjax settings class.
 *
 * @class EmberTests.MockjaxUtilsMockjaxSettings
 */
var MockjaxSettings = Ember.Object.extend({
  init : function() {
    this._super();
    this.get("responseTime");
    this.get("logging");
  },

  /**
   * If set to true, all calls will throw server error with error code 'serverErrorCode'.
   *
   * @property throwServerError
   * @type Boolean
   * @default false
   */
  throwServerError : false,

  /**
   * Server error code to throw when 'throwServerError' is set to true.
   *
   * @property serverErrorCode
   * @type Number
   * @default 500
   */
  serverErrorCode : 500,

  /**
   * Setting to 1 is equivalent to throwing a error by server in processing request.
   *
   * @property throwProcessError
   * @type Number
   * @default 0
   */
  throwProcessError : 0,

  /**
   * A map to change the model settings used for the call.
   *
   * @property modelChangeMap
   * @type Object
   */
  modelChangeMap : {},

  /**
   * An object which contains data used in the last call. Has 'model', 'type' and 'params' from last call.
   *
   * @property lastPassedData
   * @readonly
   * @type Class
   */
  lastPassedData : Ember.Object.create(),

  /**
   * Response time to use. This is a jquerymockjax setting.
   *
   * @property responseTime
   * @type Number
   * @default 50
   */
  responseTime : function(key, val) {
    if(arguments.length > 1) {
      $.mockjaxSettings.responseTime = val || MockjaxUtils.RESPONSE_TIME;
    }
  }.property(),

  /**
   * If set to true, every call will be logged. This is a jquerymockjax setting.
   *
   * @property logging
   * @type Boolean
   * @default false
   */
  logging : function(key, val) {
    if(arguments.length > 1) {
      $.mockjaxSettings.logging = Ember.isEmpty(val) ? false : val;
    }
  }.property(),
});
MockjaxSettings.MockjaxSettingsInstance = MockjaxSettings.create();

return {
  MockjaxSettings : MockjaxSettings,
};


});

define('mockjax-utils/getDataForModelType',[
  "ember",
  "./mockjaxSettings",
  "./mockjaxData",
  "jquery_mockjax",
  "lib/ember-utils-core",
], function(Ember, MockjaxSettings, MockjaxData) {
MockjaxSettings = MockjaxSettings.MockjaxSettings;

urlPartsExtractRegex = new RegExp("^/(.*)/(.*?)$");

var getDataForModelType = function(mockObj, settings, model, type) {
  if(MockjaxSettings.MockjaxSettingsInstance.get("throwServerError")) {
    mockObj.status = MockjaxSettings.MockjaxSettingsInstance.get("serverErrorCode");
    mockObj.statusText = "Server Error";
  }
  else {
    var retData = {
      result : {
        status : MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError"),
        message : MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError") ? "Failed" : "Success",
      }
    }, parts = settings.url.match(urlPartsExtractRegex),
    params = Ember.typeOf(settings.data) === "string" ? JSON.parse(settings.data.replace(/^data=/, "")) : settings.data;
    model = model || (parts && parts[1]);
    type = type || (parts && parts[2]);
    if(MockjaxSettings.MockjaxSettingsInstance.get("modelChangeMap")[model]) {
      model = MockjaxSettings.MockjaxSettingsInstance.get("modelChangeMap")[model];
    }
    MockjaxSettings.MockjaxSettingsInstance.lastPassedData = {
      model : model,
      type : type,
      params : params,
    };
    if(model && type && !MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError")) {
      var modelData = MockjaxData.MockjaxDataMap[model];
      if(type === "getAll") {
        retData.result.data = modelData.get("data");
        Utils.merge(retData.result, modelData.get("getAllAdditionalData"));
      }
      else if(type === "get") {
        retData.result.data = modelData.get("data").findBy("id", CrudAdapter.getId(params, modelData.get("modelClass")));
        Utils.merge(retData.result, modelData.get("getAdditionalData"));
      }
      else if(type === "delete") {
        retData.result.data = {
          id : CrudAdapter.getId(params, modelData.get("modelClass")),
        };
      }
    }
    mockObj.responseText = retData;
  }
};

$.mockjax({
  url: /\/.*?\/.*?/,
  type : "GET",
  response : function(settings) {
    getDataForModelType(this, settings);
  },
});

return {
  getDataForModelType : getDataForModelType,
};

});

define('mockjax-utils/createUpdateDataForModelType',[
  "ember",
  "./mockjaxSettings",
  "./mockjaxData",
  "jquery_mockjax",
  "lib/ember-utils-core",
], function(Ember, MockjaxSettings, MockjaxData) {
MockjaxSettings = MockjaxSettings.MockjaxSettings;

urlPartsExtractRegex = new RegExp("^/(.*)/(.*?)$");

var createUpdateDataForModelType = function(mockObj, settings, model, type) {
  if(MockjaxSettings.MockjaxSettingsInstance.get("throwServerError")) {
    mockObj.status = MockjaxSettings.MockjaxSettingsInstance.get("serverErrorCode");
    mockObj.statusText = "Server Error";
  }
  else {
    var retData = {
      result : {
        status : MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError"),
        message : MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError") ? "Failed" : "Success",
      }
    }, parts = settings.url.match(urlPartsExtractRegex),
    params = Ember.typeOf(settings.data) === "string" ? JSON.parse(settings.data) : settings.data;
    model = model || (parts && parts[1]);
    type = type || (parts && parts[2]);
    if(MockjaxSettings.MockjaxSettingsInstance.get("modelChangeMap")[model]) {
      model = MockjaxSettings.MockjaxSettingsInstance.get("modelChangeMap")[model];
    }
    MockjaxSettings.MockjaxSettingsInstance.lastPassedData = {
      model : model,
      type : type,
      params : params,
    };
    if(model && type && !MockjaxSettings.MockjaxSettingsInstance.get("throwProcessError")) {
      var modelData = MockjaxData.MockjaxDataMap[model];
      retData.result.data = {
        id : CrudAdapter.getId(params, modelData.get("modelClass")) || "someid",
      };
      Utils.merge(retData.result.data, modelData.get("createUpdateAdditionalData"));
    }
    mockObj.responseText = retData;
  }
};

$.mockjax({
  url: /\/.*?\/.*?/,
  type : "POST",
  response : function(settings) {
    createUpdateDataForModelType(this, settings);
  },
});

return {
  createUpdateDataForModelType : createUpdateDataForModelType,
};

});

/**
 * Wrapper to mock ajax request from CrudAdaptor module.
 *
 * @module mockjax-utils
 */

define('mockjax-utils/main',[
  "./mockjaxData",
  "./mockjaxSettings",
  "./getDataForModelType",
  "./createUpdateDataForModelType",
], function() {
  var MockjaxUtils = Ember.Namespace.create();
  //window.MockjaxUtils = MockjaxUtils;

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        MockjaxUtils[k] = arguments[i][k];
      }
    }
  }

  MockjaxUtils.RESPONSE_TIME = 100;
  $.mockjaxSettings.responseTime = MockjaxUtils.RESPONSE_TIME;
  $.mockjaxSettings.logging = false;

  return MockjaxUtils;
});

define('ember-test-utils',[
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

/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("lib/almond.js", function(){});

  // Register in the values from the outer closure for common dependencies
  // as local almond modules
  define('jquery', function() {
    return $;
  });
  define('ember', function() {
    return Ember;
  });
 
  // Use almond's special top level synchronous require to trigger factory
  // functions, get the final module, and export it as the public api.
  return require('ember-utils-core');
}));
