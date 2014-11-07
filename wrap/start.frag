(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['jquery'], factory);
  } else {
    // Browser globals.
    root.EmberTests = factory(root.$);
  }
}(this, function($) {
