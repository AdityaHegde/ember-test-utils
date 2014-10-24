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
TestUtils.setter = function(obj, path, putPath, value, param) {
  var getVal = TestUtils.getter(obj, path);
  if(getVal && getVal[0]) {
    if(Ember.typeOf(getVal[0]) === "array" || Ember.typeOf(getVal[0].get("length")) === "number") {
      switch(param[0]) {
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
          getVal[0].insertAt(param[1], value);
          break;

        case "removeAt" :
          getVal[0].removeAt(param[1]);
          break;

        default: break;
      }
    }
    else {
      getVal[0].set(putPath, value);
    }
  }
};
