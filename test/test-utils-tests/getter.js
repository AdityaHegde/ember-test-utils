define([
  "ember",
  "test-utils/getter",
], function(Ember, getter) {
getter = getter.getter;

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

  equal(getter(obj, "vara")[0], "a");
  equal(getter(obj, "varb.varc")[0], "c");
  equal(getter(obj, "varb.vard.vare")[0], "e");
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

  equal(getter(obj, "varb.0.varc")[0], "c1");
  equal(getter(obj, "varb.1.varc")[0], "c2");
  equal(getter(obj, "varb.1.vard.vare")[0], "e");
  equal(getter(obj, "varb.[varc=c3].varc")[0], "c3");
  equal(getter(obj, "varf.1")[0], "b");
  equal(getter(obj, "varb.[varc=c2]")[0], obj.get("varb").objectAt(1));
});

};

});
