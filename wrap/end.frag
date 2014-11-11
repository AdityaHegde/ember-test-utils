  // Register in the values from the outer closure for common dependencies
  // as local almond modules
  define('jquery', function() {
    return $;
  });
  define('jquery_mockjax', function() {
    return null;
  });
  define('ember', function() {
    return Ember;
  });
  define('ember_qunit', function() {
    return emq;
  });
 
  // Use almond's special top level synchronous require to trigger factory
  // functions, get the final module, and export it as the public api.
  return require('ember-test-utils');
}));
