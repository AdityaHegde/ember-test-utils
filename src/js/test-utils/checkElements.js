define([
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
