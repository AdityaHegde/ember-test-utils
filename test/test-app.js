define([
  "ember",
  "ember_qunit",
], function(Ember, emq) {

  Ember.run(function() {
    App = Ember.Application.create({
      rootElement : "#ember-testing",
    });

    emq.globalize();
    App.setupForTesting();
    App.injectTestHelpers();
    setResolver(Ember.DefaultResolver.create({ namespace: App }));
  });

  return App;

});
