(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['jquery', 'jquery_mockjax', 'ember', 'ember_qunit'], factory);
  } else {
    // Browser globals.
    root.EmberTests = factory(root.$);
  }
}(this, function($) {
