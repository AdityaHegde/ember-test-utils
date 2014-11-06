define([
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
