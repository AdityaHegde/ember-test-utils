define([
  "ember",
  "ember_qunit",
], function(Ember, emq) {

  var App;
  Ember.run(function() {
    window.App = App = Ember.Application.create({
      rootElement : "#ember-testing",
    });

    emq.globalize();
    App.setupForTesting();
    App.injectTestHelpers();
    setResolver(Ember.DefaultResolver.create({ namespace: App }));
  });

  return App;

});
