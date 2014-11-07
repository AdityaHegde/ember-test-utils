define([
  "ember",
  "source/ember-test-utils",
], function(Ember, EmberTests) {

return function() {

module("getter");

test("Simple get value", function() {
  var obj = Ember.Object.create({
    vara : "a",
    varb : Ember.Object.create({
      varc : "c",
      vard : Ember.Object.create({
        vare : "e",
      }),
    }),
  });

  equal(EmberTests.TestUtils.getter(obj, "vara")[0], "a");
  equal(EmberTests.TestUtils.getter(obj, "varb.varc")[0], "c");
  equal(EmberTests.TestUtils.getter(obj, "varb.vard.vare")[0], "e");
});

test("Get on arrays", function() {
  var obj = Ember.Object.create({
    vara : "a",
    varb : [Ember.Object.create({
      varc : "c1",
    }), Ember.Object.create({
      varc : "c2",
      vard : Ember.Object.create({
        vare : "e",
      }),
    }), Ember.Object.create({
      varc : "c3",
    })],
    varf : ["a", "b", "c"],
  });

  equal(EmberTests.TestUtils.getter(obj, "varb.0.varc")[0], "c1");
  equal(EmberTests.TestUtils.getter(obj, "varb.1.varc")[0], "c2");
  equal(EmberTests.TestUtils.getter(obj, "varb.1.vard.vare")[0], "e");
  equal(EmberTests.TestUtils.getter(obj, "varb.[varc=c3].varc")[0], "c3");
  equal(EmberTests.TestUtils.getter(obj, "varf.1")[0], "b");
  equal(EmberTests.TestUtils.getter(obj, "varb.[varc=c2]")[0], obj.get("varb").objectAt(1));
});

};

});
