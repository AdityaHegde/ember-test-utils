define([
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
