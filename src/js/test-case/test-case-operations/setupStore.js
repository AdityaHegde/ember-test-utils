define([
  "ember",
  "./testOperation",
  "lib/ember-utils-core",
  "../../test-utils/main",
], function(Ember, TestOperation) {

/**
 * Test Operation to setup ember data store.
 *
 * @class SetupStore
 */
var SetupStore = TestOperation.TestOperation.extend({
  run : function(testData) {
    var testContext = testData.get("testContext"),
        container = (testContext.get ? testContext.get("container") : testContext.container),
        store;
    if(testContext.store) {
      store = testContext.store();
      container = store.container;
    }
    else if (DS._setupContainer) {
      DS._setupContainer(container);
    }
    else {
      container.register('store:main', DS.Store);
    }

    container.register('adapter:application', testData.get("ApplicationAdapter"));
    container.register('serializer:application', testData.get("ApplicationSerializer"));

    testData.set("store", container.lookup('store:main'));
  },
});

return {
  SetupStore : SetupStore,
};

});
