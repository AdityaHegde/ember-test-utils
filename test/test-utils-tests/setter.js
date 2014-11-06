define([
  "ember",
  "test-utils/getter",
  "test-utils/setter",
], function(Ember, getter, setter) {
getter = getter.getter;
setter = setter.setter;

return function() {

module("setter");

test("Simple set value", function() {
  var obj = Ember.Object.create({
    vara : "a",
    varb : Ember.Object.create({
      varc : "c",
      vard : Ember.Object.create({
        vare : "e",
      }),
    }),
  });

  Ember.run(function() {
    setter(obj, "", "vara", "a1");
    setter(obj, "varb", "varc", "c1");
    setter(obj, "varb.vard", "vare", "e1");
  });

  equal(getter(obj, "vara")[0], "a1");
  equal(getter(obj, "varb.varc")[0], "c1");
  equal(getter(obj, "varb.vard.vare")[0], "e1");
});

test("Set on arrays", function() {
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
  });

  Ember.run(function() {
    setter(obj, "varb.0", "varc", "c_1");
    setter(obj, "varb.1", "varc", "c_2");
    setter(obj, "varb.1.vard", "vare", "e1");
    setter(obj, "varb.[varc=c3]", "varc", "c_3");
  });

  equal(getter(obj, "varb.0.varc")[0], "c_1");
  equal(getter(obj, "varb.1.varc")[0], "c_2");
  equal(getter(obj, "varb.1.vard.vare")[0], "e1");
  equal(getter(obj, "varb.[varc=c_3].varc")[0], "c_3");
});

test("array modifiers", function() {
  var obj = Ember.Object.create({
    vara : ["a", "b", "c"],
  });

  Ember.run(function() {
    setter(obj, "vara", "", "", "pop");
  });
  equal(obj.get("vara.length"), 2);

  Ember.run(function() {
    setter(obj, "vara", "", "d", "push");
  });
  equal(getter(obj, "vara.2")[0], "d");
  equal(obj.get("vara.length"), 3);

  Ember.run(function() {
    setter(obj, "vara", "", "e", "unshift");
  });
  equal(getter(obj, "vara.0")[0], "e");
  equal(obj.get("vara.length"), 4);

  Ember.run(function() {
    setter(obj, "vara", "", "", "shift");
  });
  equal(getter(obj, "vara.0")[0], "a");
  equal(obj.get("vara.length"), 3);

  Ember.run(function() {
    setter(obj, "vara", "", "b", "remove");
  });
  equal(getter(obj, "vara.1")[0], "d");
  equal(obj.get("vara.length"), 2);

  Ember.run(function() {
    setter(obj, "vara", 1, "b", "insertAt");
  });
  equal(getter(obj, "vara.1")[0], "b");
  equal(obj.get("vara.length"), 3);

  Ember.run(function() {
    setter(obj, "vara", 1, "", "removeAt");
  });
  equal(getter(obj, "vara.0")[0], "a");
  equal(obj.get("vara.length"), 2);
});

};

});
