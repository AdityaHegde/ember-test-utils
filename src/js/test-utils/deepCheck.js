define([
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
