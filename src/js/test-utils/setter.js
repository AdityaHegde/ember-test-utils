define([
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
