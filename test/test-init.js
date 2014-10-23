App = Ember.Application.create({
  rootElement : "#ember-testing",
});

App.setupForTesting();
App.injectTestHelpers();
setResolver(Ember.DefaultResolver.create({ namespace: App }));
