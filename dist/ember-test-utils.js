(function () {define('test-utils/checkElements',[
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
   * @class TestUtils
   */
  var TestUtils = Ember.Namespace.create();
  window.TestUtils = TestUtils;

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

(function () {define('core/hasMany',[
  "ember",
], function() {

/**
 * Creates a computed property for an array that when set with array of native js object will return an array of instances of a class.
 *
 * The class is decided by the 1st param 'modelClass'. If it is not a class but an object and 'modelClassKey', the 2nd parameter is a string,
 * then the 'modelClassKey' in the object is used as a key in 'modelClass' the object to get the class.
 * 'defaultKey' the 3rd parameter is used as a default if object[modelClassKey] is not present.
 *
 * @method hasMany
 * @param {Class|Object} modelClass
 * @param {String} [modelClassKey]
 * @param {String} [defaultKey]
 * @returns {Instance}
 */
function hasMany(modelClass, modelClassKey, defaultKey) {
  modelClass = modelClass || Ember.Object;
  var hasInheritance = Ember.typeOf(modelClass) !== "class";

  return Ember.computed(function(key, newval) {
    if(Ember.typeOf(modelClass) === 'string') {
      modelClass = Ember.get(modelClass);
      hasInheritance = Ember.typeOf(modelClass) !== "class";
    }
    if(arguments.length > 1) {
      if(newval && newval.length) {
        newval.beginPropertyChanges();
        for(var i = 0; i < newval.length; i++) {
          var obj = newval[i], classObj = modelClass;
          if(hasInheritance) classObj = modelClass[Ember.isEmpty(obj[modelClassKey]) ? defaultKey : obj[modelClassKey]];
          if(!(obj instanceof classObj)) {
            obj = classObj.create(obj);
            obj.set("parentObj", this);
          }
          newval.splice(i, 1, obj);
        }
        newval.endPropertyChanges();
      }
      return newval;
    }
  });
};

return {
  hasMany : hasMany,
};


});

define('core/belongsTo',[
  "ember",
], function() {

/**
 * Creates a computed property for an object that when set with native js object will return an instances of a class.
 *
 * The class is decided by the 1st param 'modelClass'. If it is not a class but an object and 'modelClassKey', the 2nd parameter is a string,
 * then the 'modelClassKey' in the object is used as a key in 'modelClass' the object to get the class.
 * 'defaultKey' the 3rd parameter is used as a default if object[modelClassKey] is not present.
 *
 * Optionally can create the instance with mixin. A single mixin can be passed or a map of mixins as 4th parameter with key extracted from object using mixinKey (5th parameter) can be passed.
 * 'defaultMixin' (6th parameter) is used when object[mixinKey] is not present.
 *
 * @method belongsTo
 * @param {Class|Object} modelClass
 * @param {String} [modelClassKey]
 * @param {String} [defaultKey]
 * @param {Mixin|Object} [mixin]
 * @param {String} [mixinKey]
 * @param {String} [defaultMixin]
 * @returns {Instance}
 */
function belongsTo(modelClass, modelClassKey, defaultKey, mixin, mixinKey, defaultMixin) {
  modelClass = modelClass || Ember.Object;
  var hasInheritance = Ember.typeOf(modelClass) !== "class",
      hasMixin = mixin instanceof Ember.Mixin;
  return Ember.computed(function(key, newval) {
    if(Ember.typeOf(modelClass) === 'string') {
      modelClass = Ember.get(modelClass);
      hasInheritance = Ember.typeOf(modelClass) !== "class";
    }
    if(Ember.typeOf(mixin) === 'string') {
      mixin = Ember.get(mixin);
      hasMixin = mixin instanceof Ember.Mixin;
    }
    if(arguments.length > 1) {
      if(newval) {
        var classObj = modelClass;
        if(hasInheritance) classObj = modelClass[Ember.isEmpty(newval[modelClassKey]) ? defaultKey : newval[modelClassKey]];
        if(!(newval instanceof classObj)) {
          if(hasMixin) {
            newval = classObj.createWithMixins(newval, mixinMap[newval[mixinKey] || defaultMixin]);
          }
          else {
            newval = classObj.create(newval);
          }
          newval.set("parentObj", this);
        }
      }
      return newval;
    }
  });
};

return {
  belongsTo : belongsTo,
}


});

define('core/hierarchy',[
  "ember",
], function() {


function getMetaFromHierarchy(hasManyHierarchy) {
  var meta = {};
  for(var i = 0; i < hasManyHierarchy.length; i++) {
    for(var c in hasManyHierarchy[i].classes) {
      if(hasManyHierarchy[i].classes.hasOwnProperty(c)) {
        meta[c] = {
          level : i,
        };
      }
    }
  }
  hasManyHierarchy.hierarchyMeta = meta;
  return meta;
}

/**
 * Register a hierarchy. This will setup the meta of the hierarchy.
 *
 * @method registerHierarchy
 * @param {Object} hierarchy
 */
function registerHierarchy(hierarchy) {
  hierarchy.hierarchyMeta = getMetaFromHierarchy(hierarchy);
};

/**
 * Add an entry to the hierarchy. It takes care of updating meta also.
 *
 * @method addToHierarchy
 * @param {Object} hierarchy
 * @param {String} type
 * @param {Class} classObj
 * @param {Number} level
 */
function addToHierarchy(hierarchy, type, classObj, level) {
  var meta = hierarchy.hierarchyMeta;
  hierarchy[level].classes[type] = classObj;
  meta[type] = {
    level : level,
  };
};

function getObjForHierarchyLevel(obj, meta, hierarchy, level) {
  var param = {};
  param[hierarchy[level].childrenKey] = Ember.typeOf(obj) === "array" ? obj : [obj];
  return hierarchy[level].classes[hierarchy[level].base].create(param);
}

function getObjTillLevel(obj, meta, hierarchy, fromLevel, toLevel) {
  for(var i = fromLevel - 1; i >= toLevel; i--) {
    obj = getObjForHierarchyLevel(obj, meta, hierarchy, i);
  }
  return obj;
}

/**
 * Creates a computed property which creates a class for every element in the set array based on hierarchy.
 * The objects in the array can be of any level at or below the current level. An instance with the basic class is automatically wrapped around the objects at lower level.
 *
 * @method hasManyWithHierarchy
 * @param {Object} hasManyHierarchy Assumed to be already initialized by calling 'registerHierarchy'.
 * @param {Number} level Level of the computed property.
 * @param {String} key Key used to get the key used in retrieving the class object in the classes map.
 * @returns {Instance}
 */
function hasManyWithHierarchy(hasManyHierarchy, level, hkey) {
  var meta;
  if(Ember.typeOf(hasManyHierarchy) === "array") {
    meta = hasManyHierarchy.hierarchyMeta;
  }
  return Ember.computed(function(key, newval) {
    if(arguments.length > 1) {
      if(Ember.typeOf(hasManyHierarchy) === "string") {
        hasManyHierarchy = Ember.get(hasManyHierarchy);
        meta = hasManyHierarchy.hierarchyMeta;
      }
      if(newval) {
        //curLevel, curLevelArray
        var cl = -1, cla = [];
        for(var i = 0; i < newval.length; i++) {
          var obj = newval[i], _obj = {},
              type = Ember.typeOf(obj) === "array" ? obj[0] : obj[hkey],
              objMeta = meta[type];
          if(Ember.typeOf(obj) !== "instance") {
            if(objMeta && objMeta.level >= level) {
              if(Ember.typeOf(obj) === "array") {
                for(var j = 0; j < hasManyHierarchy[objMeta.level].keysInArray.length; j++) {
                  if(j < obj.length) {
                    _obj[hasManyHierarchy[objMeta.level].keysInArray[j]] = obj[j];
                  }
                }
              }
              else {
                _obj = obj;
              }
              _obj = hasManyHierarchy[objMeta.level].classes[type].create(_obj);
              if(cl === -1 || cl === objMeta.level) {
                cla.push(_obj);
                cl = objMeta.level;
              }
              else if(cl < objMeta.level) {
                cla.push(getObjTillLevel(_obj, meta, hasManyHierarchy, objMeta.level, cl));
              }
              else {
                var curObj = getObjForHierarchyLevel(cla, meta, hasManyHierarchy, objMeta.level);
                cl = objMeta.level;
                cla = [curObj, _obj];
              }
            }
          }
          else {
            cla.push(obj);
          }
        }
        if(cl === level || cl === -1) {
          newval = cla;
        }
        else {
          newval = [getObjTillLevel(cla, meta, hasManyHierarchy, cl, level)];
        }
      }
      return newval;
    }
  });
};


return {
  registerHierarchy : registerHierarchy,
  addToHierarchy : addToHierarchy,
  hasManyWithHierarchy : hasManyWithHierarchy,
};

});

define('core/objectWithArrayMixin',[
  "ember",
], function() {


/**
 * A mixin to add observers to array properties.
 *
 * @class ObjectWithArrayMixin
 */
var ObjectWithArrayMixin = Ember.Mixin.create({
  init : function() {
    this._super();
    this.set("arrayProps", this.get("arrayProps") || []);
    this.addArrayObserverToProp("arrayProps");
    this.set("arrayProps.propKey", "arrayProps");
    this.arrayPropsWasAdded(this.get("arrayProps"));
  },

  addBeforeObserverToProp : function(propKey) {
    Ember.addBeforeObserver(this, propKey, this, "propWillChange");
  },

  removeBeforeObserverFromProp : function(propKey) {
    Ember.removeBeforeObserver(this, propKey, this, "propWillChange");
  },

  addObserverToProp : function(propKey) {
    Ember.addObserver(this, propKey, this, "propDidChange");
  },

  removeObserverFromProp : function(propKey) {
    Ember.removeObserver(this, propKey, this, "propDidChange");
  },

  propWillChange : function(obj, key) {
    this.removeArrayObserverFromProp(key);
    var prop = this.get(key);
    if(prop && prop.objectsAt) {
      var idxs = Utils.getArrayFromRange(0, prop.get("length"));
      this[key+"WillBeDeleted"](prop.objectsAt(idxs), idxs, true);
    }
  },

  propDidChange : function(obj, key) {
    this.addArrayObserverToProp(key);
    var prop = this.get(key);
    if(prop) {
      this.propArrayNotifyChange(prop, key);
    }
  },

  propArrayNotifyChange : function(prop, key) {
    if(prop.objectsAt) {
      var idxs = Utils.getArrayFromRange(0, prop.get("length"));
      this[key+"WasAdded"](prop.objectsAt(idxs), idxs, true);
    }
  },

  addArrayObserverToProp : function(propKey) {
    var prop = this.get(propKey);
    if(prop && prop.addArrayObserver) {
      prop.set("propKey", propKey);
      prop.addArrayObserver(this, {
        willChange : this.propArrayWillChange,
        didChange : this.propArrayDidChange,
      });
    }
  },

  removeArrayObserverFromProp : function(propKey) {
    var prop = this.get(propKey);
    if(prop && prop.removeArrayObserver) {
      prop.removeArrayObserver(this, {
        willChange : this.propArrayWillChange,
        didChange : this.propArrayDidChange,
      });
    }
  },

  propArrayWillChange : function(array, idx, removedCount, addedCount) {
    if((array.content || array.length) && array.get("length") > 0) {
      var propKey = array.get("propKey"), idxs = Utils.getArrayFromRange(idx, idx + removedCount);
      this[propKey+"WillBeDeleted"](array.objectsAt(idxs), idxs);
    }
  },
  propArrayDidChange : function(array, idx, removedCount, addedCount) {
    if((array.content || array.length) && array.get("length") > 0) {
      var propKey = array.get("propKey"),
          addedIdxs = [], removedObjs = [],
          rc = 0;
      for(var i = idx; i < idx + addedCount; i++) {
        var obj = array.objectAt(i);
        if(!this[propKey+"CanAdd"](obj, i)) {
          removedObjs.push(obj);
          rc++;
        }
        else {
          addedIdxs.push(i);
        }
      }
      if(addedIdxs.length > 0) {
        this[propKey+"WasAdded"](array.objectsAt(addedIdxs), addedIdxs);
      }
      if(removedObjs.length > 0) {
        array.removeObjects(removedObjs);
      }
    }
  },

  /**
   * Method called just before array elements will be deleted. This is a fallback method. A method with name <propKey>WillBeDeleted can be added to handle for 'propKey' seperately.
   *
   * @method propWillBeDeleted
   * @param {Array} eles The elements that will be deleted.
   * @param {Array} idxs The indices of the elements that will be deleted.
   */
  propWillBeDeleted : function(eles, idxs) {
  },
  /**
   * Method called when deciding whether to add an ele or not. This is a fallback method. A method with name <propKey>CanAdd can be added to handle for 'propKey' seperately.
   *
   * @method propCanAdd
   * @param {Object|Instance} ele The element that can be added or not.
   * @param {Number} idx The indice of the element that can be added or not.
   * @returns {Boolean}
   */
  propCanAdd : function(ele, idx) {
    return true;
  },
  /**
   * Method called after array elements are added. This is a fallback method. A method with name <propKey>WasAdded can be added to handle for 'propKey' seperately.
   *
   * @method propWasAdded
   * @param {Array} eles The elements that are added.
   * @param {Array} idxs The indices of the elements that are added.
   */
  propWasAdded : function(eles, idxs) {
  },

  /**
   * List of keys to array properties.
   *
   * @property arrayProps
   * @type Array
   */
  arrayProps : null,
  arrayPropsWillBeDeleted : function(arrayProps) {
    for(var i = 0; i < arrayProps.length; i++) {
      this.removeArrayObserverFromProp(arrayProps[i]);
      this.removeBeforeObserverFromProp(arrayProps[i]);
      this.removeObserverFromProp(arrayProps[i]);
    }
  },
  arrayPropsCanAdd : function(ele, idx) {
    return true;
  },
  arrayPropsWasAdded : function(arrayProps) {
    for(var i = 0; i < arrayProps.length; i++) {
      this.arrayPropWasAdded(arrayProps[i]);
    }
  },
  arrayPropWasAdded : function(arrayProp) {
    var prop = this.get(arrayProp);
    if(!this[arrayProp+"WillBeDeleted"]) this[arrayProp+"WillBeDeleted"] = this.propWillBeDeleted;
    if(!this[arrayProp+"CanAdd"]) this[arrayProp+"CanAdd"] = this.propCanAdd;
    if(!this[arrayProp+"WasAdded"]) this[arrayProp+"WasAdded"] = this.propWasAdded;
    if(!prop) {
      this.set(arrayProp, []);
    }
    else {
      this.propArrayNotifyChange(prop, arrayProp);
    }
    this.addArrayObserverToProp(arrayProp);
    this.addBeforeObserverToProp(arrayProp);
    this.addObserverToProp(arrayProp);
  },

});


return {
  ObjectWithArrayMixin : ObjectWithArrayMixin,
};

});

define('core/delayedAddToHasMany',[
  "ember",
  "./objectWithArrayMixin",
], function(objectWithArrayMixin) {


/**
 * A mixin to add observers to array properties. Used in belongsTo of a ember-data model.
 * Adds after the HasMany object is resolved.
 *
 * @class DelayedAddToHasMany
 * @extends ObjectWithArrayMixin
 */
var delayAddId = 0;
var DelayedAddToHasMany = Ember.Mixin.create(objectWithArrayMixin, {
  init : function() {
    this._super();
    this.set("arrayPropDelayedObjs", {});
  },

  arrayPropDelayedObjs : null,

  addDelayObserverToProp : function(propKey, method) {
    method = method || "propWasUpdated";
    Ember.addObserver(this, propKey, this, method);
  },

  removeDelayObserverFromProp : function(propKey) {
    method = method || "propWasUpdated";
    Ember.removeObserver(this, propKey, this, method);
  },

  propArrayNotifyChange : function(prop, key) {
    if(prop.then) {
      prop.set("canAddObjects", false);
      prop.then(function() {
        prop.set("canAddObjects", true);
      });
    }
    else {
      for(var i = 0; i < prop.get("length"); i++) {
        this[key+"WasAdded"](prop.objectAt(i), i, true);
      }
    }
  },

  /**
   * Method to add a property after the array prop loads.
   *
   * @property addToProp
   * @param {String} prop Property of array to add to.
   * @param {Instance} propObj Object to add to array.
   */
  addToProp : function(prop, propObj) {
    var arrayPropDelayedObjs = this.get("arrayPropDelayedObjs"), propArray = this.get(prop);
    if(propArray.get("canAddObjects")) {
      if(!propArray.contains(propObj)) {
        propArray.pushObject(propObj);
      }
    }
    else {
      arrayPropDelayedObjs[prop] = arrayPropDelayedObjs[prop] || [];
      if(!arrayPropDelayedObjs[prop].contains(propObj)) {
        arrayPropDelayedObjs[prop].push(propObj);
      }
    }
  },

  hasArrayProp : function(prop, findKey, findVal) {
    var arrayPropDelayedObjs = this.get("arrayPropDelayedObjs"), propArray = this.get(prop);
    if(propArray.get("canAddObjects")) {
      return !!propArray.findBy(findKey, findVal);
    }
    else if(arrayPropDelayedObjs && arrayPropDelayedObjs[prop]) {
      return !!arrayPropDelayedObjs[prop].findBy(findKey, findVal);
    }
    return false;
  },

  addToContent : function(prop) {
    var arrayPropDelayedObjs = this.get("arrayPropDelayedObjs"), propArray = this.get(prop);
    if(propArray.get("canAddObjects") && arrayPropDelayedObjs[prop]) {
      arrayPropDelayedObjs[prop].forEach(function(propObj) {
        if(!propArray.contains(propObj)) {
          propArray.pushObject(propObj);
        }
      }, propArray);
      delete arrayPropDelayedObjs[prop];
    }
  },

  arrayProps : null,
  arrayPropsWillBeDeleted : function(arrayProp) {
    this._super(arrayProp);
    this.removeDelayObserverFromProp(arrayProp+".canAddObjects");
  },
  arrayPropWasAdded : function(arrayProp) {
    this._super(arrayProp);
    var prop = this.get(arrayProp), that = this;
    if(!this["addTo_"+arrayProp]) this["addTo_"+arrayProp] = function(propObj) {
      that.addToProp(arrayProp, propObj);
    };
    this.addDelayObserverToProp(arrayProp+".canAddObjects", function(obj, key) {
      that.addToContent(arrayProp);
    });
  },

});


return {
  DelayedAddToHasMany : DelayedAddToHasMany,
};

});

define('core/misc',[
  "ember",
], function() {

/**
 * Search in a multi level array.
 *
 * @method deepSearchArray
 * @param {Object} d Root object to search from.
 * @param {any} e Element to search for.
 * @param {String} k Key of the element in the object.
 * @param {String} ak Key of the array to dig deep.
 * @returns {Object} Returns the found object.
 */
function deepSearchArray(d, e, k, ak) { //d - data, e - element, k - key, ak - array key
  if(e === undefined || e === null) return null;
  if(d[k] === e) return d;
  if(d[ak]) {
    for(var i = 0; i < d[ak].length; i++) {
      var ret = Utils.deepSearchArray(d[ak][i], e, k, ak);
      if(ret) {
        return ret;
      }
    }
  }
  return null;
};

/**
 * Binary insertion within a sorted array.
 *
 * @method binaryInsert
 * @param {Array} a Sorted array to insert in.
 * @param {any} e Element to insert.
 * @param {Function} [c] Optional comparator to use.
 */
var cmp = function(a, b) {
  return a - b;
};
var binarySearch = function(a, e, l, h, c) {
  var i = Math.floor((h + l) / 2), o = a.objectAt(i);
  if(l > h) return l;
  if(c(e, o) >= 0) {
    return binarySearch(a, e, i + 1, h, c);
  }
  else {
    return binarySearch(a, e, l, i - 1, c);
  }
};
function binaryInsert(a, e, c) {
  c = c || cmp;
  var len = a.get("length");
  if(len > 0) {
    var i = binarySearch(a, e, 0, len - 1, c);
    a.insertAt(i, e);
  }
  else {
    a.pushObject(e);
  }
};

/**
 * Merge a src object to a tar object and return tar.
 *
 * @method merge
 * @param {Object} tar Target object.
 * @param {Object} src Source object.
 * @param {Boolean} [replace=false] Replace keys if they already existed.
 * @returns {Object} Returns the target object.
 */
function merge(tar, src, replace) {
  for(var k in src) {
    if(!src.hasOwnProperty(k) || !Ember.isNone(tar[k])) {
      continue;
    }
    if(Ember.isEmpty(tar[k]) || replace) {
      tar[k] = src[k];
    }
  }
  return tar;
};

/**
 * Checks if an object has any key.
 *
 * @method hashHasKeys
 * @param {Object} hash Object to check for keys.
 * @returns {Boolean}
 */
function hashHasKeys(hash) {
  for(var k in hash) {
    if(hash.hasOwnProperty(k)) return true;
  }
  return false;
};

/**
 * Returns an array of integers from a starting number to another number with steps.
 *
 * @method getArrayFromRange
 * @param {Number} l Starting number.
 * @param {Number} h Ending number.
 * @param {Number} s Steps.
 * @returns {Array}
 */
function getArrayFromRange(l, h, s) {
  var a = [];
  s = s || 1;
  for(var i = l; i < h; i += s) {
    a.push(i);
  }
  return a;
};

var extractIdRegex = /:(ember\d+):?/;
/**
 * Get the ember assigned id to the instance.
 *
 * @method getEmberId
 * @param {Instance} obj
 * @returns {String} Ember assigned id.
 */
function getEmberId(obj) {
  var str = obj.toString(), match = str.match(Utils.ExtractIdRegex);
  return match && match[1];
};

/**
 * Recursively return the offset of an element relative to a parent element.
 *
 * @method getOffset
 * @param {DOMElement} ele
 * @param {String} type Type of the offset.
 * @param {String} parentSelector Selector for the parent.
 * @param {Number} Offset.
 */
function getOffset(ele, type, parentSelector) {
  parentSelector = parentSelector || "body";
  if(!Ember.isEmpty($(ele).filter(parentSelector))) {
    return 0;
  }
  return ele["offset"+type] + Utils.getOffset(ele.offsetParent, type, parentSelector);
};

function emberDeepEqual(src, tar) {
  for(var k in tar) {
    var kObj = src.get(k);
    if(Ember.typeOf(tar[k]) === "object" || Ember.typeOf(tar[k]) === "instance") {
      return Utils.emberDeepEqual(kObj, tar[k]);
    }
    else if(Ember.typeOf(tar[k]) === "array") {
      for(var i = 0; i < tar[k].length; i++) {
        if(!Utils.emberDeepEqual(kObj.objectAt(i), tar[k][i])) {
          return false;
        }
      }
    }
    else if(tar[k] !== kObj) {
      console.log(kObj + " not equal to " + tar[k] + " for key : " + k);
      return false;
    }
  }
  return true;
};

return {
  deepSearchArray : deepSearchArray,
  binaryInsert : binaryInsert,
  merge : merge,
  getArrayFromRange : getArrayFromRange,
  getEmberId : getEmberId,
  getOffset : getOffset,
  emberDeepEqual : emberDeepEqual,
};

});

/**
 * Core module for ember-utils.
 *
 * @module ember-utils-core
 */
define('core/main',[
  "ember",
  "./hasMany",
  "./belongsTo",
  "./hierarchy",
  "./delayedAddToHasMany",
  "./objectWithArrayMixin",
  //"./hashMapArray",
  "./misc",
], function() {
  var Utils = Ember.Namespace.create();
  window.Utils = Utils;

  //start after DS
  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      if(arguments[i].hasOwnProperty(k)) {
        Utils[k] = arguments[i][k];
      }
    }
  }

  return Utils;
});


require(["core/main"]);
}());
define("lib/ember-utils-core", function(){});

define('test-case/testCase',[
  "ember",
  "lib/ember-utils-core",
], function(Ember) {

/**
 * Test Case class.
 *
 * @class TestCase
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
  testBlocks : Utils.hasManyWithHierarchy("TestCase.TestHierarchyMap", 1, "type"),

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
], function(Ember) {

/**
 * Test Case Block. A block of operations run synchronously. They are preeceded by a wait() and enclosed in andThen().
 *
 * @class TestBlock
 */
var TestBlock = Ember.Object.extend({
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
 * @class TestOperation
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
 * @class TestValueCheckObject
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
], function(Ember, TestOperation, TestValueCheckHierarchy) {

/**
 * Test Operation to check a set of values.
 *
 * @class TestValuesCheck
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

define('test-case/test-case-operations/testValueAssignObject',[
  "ember",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember) {


/**
 * Object that has config for checking a value.
 *
 * @class TestValueAssignObject
 */
var TestValueAssignObject = Ember.Object.extend({
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
  TestValueAssignObject : TestValueAssignObject,
};

});

define('test-case/test-case-operations/testValueAssignHierarchy',[
  "ember",
  "./testValueAssignObject",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestValueAssignObject) {

var TestValueAssignHierarchy = [
  {
    classes : {
      "base" : TestValueAssignObject.TestValueAssignObject,
    },
    base : "base",
    keysInArray : ["type", "path", "putPath", "value", "param", "valuePath"],
  },
];
Utils.registerHierarchy(TestValueAssignHierarchy);

return TestValueAssignHierarchy;

});

define('test-case/test-case-operations/testAssignValues',[
  "ember",
  "./testOperation",
  "./testValueAssignHierarchy",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation, TestValueAssignHierarchy) {

/**
 * Test Operation to check a set of values.
 *
 * @class TestAssignValues
 */
TestAssignValues = TestOperation.TestOperation.extend({
  values : Utils.hasManyWithHierarchy(TestValueAssignHierarchy, 0, "type"),

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
 * @class SetupStore
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
 * @class TestSuit
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
 * @class EmberTestSuit
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

/**
 * Test Operations submodule.
 *
 * @module test-case
 * @submodule test-case-operation
 */

define('test-case/test-case-operations/main',[
  "./testOperation",
  "./testAssignValues",
  "./testValueAssignObject",
  "./testValueCheckObject",
  "./testValuesCheck",
  "./setupStore",
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
 * @method addToTestHierarchy
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
 * Module with misc methods.
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
  window.TestCase = TestCase;

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
 * @class MockjaxData
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
 * @class MockjaxSettings
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
  window.MockjaxUtils = MockjaxUtils;

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

define('main',[
  "ember",
  "./test-utils/main",
  "./test-case/main",
  "./mockjax-utils/main",
], function(Ember, TestUtils, TestCase, MockjaxUtils) {
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
});


require(["main"]);
}());