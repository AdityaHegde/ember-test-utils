/**
 * Utility funcitons for testing.
 *
 * @module test-utils
 */

TestUtils = Ember.Namespace.create();

/**
 * @class TestUtils
 */

/**
 * Check a list of elements in an array.
 *
 * @method TestUtils.checkElements
 * @static
 * @param {Array} array The array to check in.
 * @param {String} path The path in array to compare to.
 * @param {Array} expected The array of expected values to be present in array.
 * @param {Boolean} [exactCheck=false] Checks the exact position of elements in expected in array if true.
 */
TestUtils.checkElements = function(array, path, expected, exactCheck) {
  equal(array.get("length"), expected.length, expected.length+" elements are there");
  for(var i = 0; i < expected.length; i++) {
    if(exactCheck) {
      var arrayObj = array.objectAt(i);
      TestUtils.equal(arrayObj.get(path), expected[i], "element at index "+i+" has "+path+" = "+expected[i]);
    }
    else {
      var found = array.findBy(path, expected[i]);
      TestUtils.ok(found, "element with "+path+" = "+expected[i]+" is present in arrangedContent");
    }
  }
}

/**
 * Get current date with offset.
 *
 * @method TestUtils.getCurDate
 * @static
 * @param {Number} [offset] Offset from current date. Can be negative.
 * @returns {Date} Returns local date + time.
 */
TestUtils.getCurDate = function(offset) {
  var d = new Date();
  if(offset) {
    d = new Date(d.getTime() + offset*1000);
  }
  return d.toLocaleDateString()+" "+d.toTimeString();
}

/**
 * Checks a set of attributes in an ember object.
 *
 * @method TestUtils.hasAttrs
 * @static
 * @param {Class} obj Ember object to check in.
 * @param {Object} attrs An object with key values pairs to check in obj.
 * @returns {Boolean} Returns true if obj has attrs else false.
 */
TestUtils.hasAttrs = function(obj, attrs) {
  for(var a in attrs) {
    if(attrs.hasOwnProperty(a)) {
      if(obj.get(a) !== attrs[a]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Setups up a store within a container and returns it.
 *
 * @method TestUtils.setupStore
 * @static
 * @param {Class} container Container to setup the store within.
 * @returns {Class} Created store.
 */
TestUtils.setupStore = function(container) {
  if (DS._setupContainer) {
    DS._setupContainer(container);
  } else {
    container.register('store:main', DS.Store);
  }

  container.register('adapter:application', CrudAdapter.ApplicationAdapter);
  container.register('serializer:application', CrudAdapter.ApplicationSerializer);

  return container.lookup('store:main');
}

/**
 * Setup app to start emmiting events without passing advance readinies to save time. Also registers a few views missing by default (bug?).
 *
 * @method TestUtils.setupAppForTesting
 * @static
 * @param {Class} app App object.
 * @param {Class} container Container object.
 */
TestUtils.setupAppForTesting = function(app, container) {
  Ember.run(function() {
    app.setupEventDispatcher();
    app.resolve(app);
    container.register('view:select', Ember.Select);
    container.register('view:checkbox', Ember.Checkbox);
  });
}

/**
 * Advanced getter with a few extra features.
 * Use .i. to get into indiex i.
 * Use [a=b] to run findBy(a, b).
 *
 * @method TestUtils.getter
 * @static
 * @param {Class} obj Object to get from.
 * @param {String} path Path to get from.
 * @return {Array} Returns an array with [value, lastObj extracted, last part of path]
 */
TestUtils.getter = function(obj, path) {
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
};

/**
 * Advanced setter with call to TestUtils.getter
 *
 * @method TestUtils.setter
 * @static
 * @param {Class} obj Object to put to.
 * @param {String} path Path to object at the last part. If the last object is array, array modification is fired.
 * @param {String} putPath Path to put to at the object at last part. In case of array modification like push putPath will be an array with 0th element as the operation (allowed - push, pop, unshift, shift, remove, insertAt, removeAt) and 1st element as the index.
 * @param {any} value Value to put.
 */
TestUtils.setter = function(obj, path, putPath, value) {
  var getVal = TestUtils.getter(obj, path);
  if(getVal && getVal[0]) {
    if(Ember.typeOf(getVal[0]) === "array" || Ember.typeOf(getVal[0].get("length")) === "number") {
      switch(putPath[0]) {
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
          getVal[0].insertAt(putPath[1], value);
          break;

        case "removeAt" :
          getVal[0].removeAt(putPath[1]);
          break;

        default: break;
      }
    }
    else {
      getVal[0].set(putPath, value);
    }
  }
};

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
  init : function() {
    this._super();
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

$.mockjaxSettings.logging = false;
$.mockjaxSettings.responseTime = 50;

var mockjaxSettings = Ember.Object.create({
  throwServerError : false,
  serverErrorCode : 500,
  throwProcessError : 0,
  returnId : false,
  modelChangeMap : {},
}),
mockjaxData = {
},
urlPartsExtractRegex = new RegExp("^/(.*)/(.*?)$");

function getDataForModelType(settings, model, type) {
  var retData = {
    result : {
      status : mockjaxSettings.throwProcessError,
      message : mockjaxSettings.throwProcessError ? "Failed" : "Success",
    }
  }, parts = settings.url.match(urlPartsExtractRegex),
  params = Ember.typeOf(settings.data) === "string" ? JSON.parse(settings.data.replace(/^data=/, "")) : settings.data;
  model = model || (parts && parts[1]);
  type = type || (parts && parts[2]);
  if(mockjaxSettings.modelChangeMap[model]) {
    model = mockjaxSettings.modelChangeMap[model];
  }
  mockjaxData.lastPassedData = {
    model : model,
    type : type,
    params : params,
  };
  if(model && type) {
    var modelData = mockjaxData[model];
    if(type === "getAll") {
      retData.result.data = modelData.data;
      if(modelData.getAllAdditionalData) {
        Utils.merge(retData.result, modelData.getAllAdditionalData);
      }
    }
    else if(type === "get") {
      retData.result.data = modelData.data.findBy("id", CrudAdapter.getId(params, modelData.modelClass));
      if(modelData.getAdditionalData) {
        Utils.merge(retData.result, modelData.getAdditionalData);
      }
    }
    else if(type === "delete") {
      retData.result.data = {
        id : CrudAdapter.getId(params, modelData.modelClass),
      };
    }
  }
  return retData;
}

$.mockjax({
  url: /\/.*?\/.*?/,
  type : "GET",
  response : function(settings) {
    this.responseText = getDataForModelType(settings);
  },
});

$.mockjax({
  url: /\/.*?\/.*?/,
  type : "POST",
  response : function(settings) {
    //console.log(settings.data);
    if(mockjaxSettings.throwServerError) {
      this.status = mockjaxSettings.serverErrorCode;
      this.statusText = "Server Error";
    }
    else {
      var retData = {
        result : {
          status : mockjaxSettings.throwProcessError,
          message : mockjaxSettings.throwProcessError ? "Failed" : "Success",
        }
      }, parts = settings.url.match(urlPartsExtractRegex),
      model = parts && parts[1],
      type = parts && parts[2],
      params = Ember.typeOf(settings.data) === "string" ? JSON.parse(settings.data) : settings.data,
      modelData = model && mockjaxData[model];
      mockjaxData.lastPassedData = {
        model : model,
        type : type,
        params : params,
      };
      retData.result.data = {
        id : type === "update" ? CrudAdapter.getId(params, modelData.modelClass) : null,
      };
      if(modelData.createUpdateData) {
        Utils.merge(retData.result.data, modelData.createUpdateData);
      }
      this.responseText = retData;
    }
  },
});
