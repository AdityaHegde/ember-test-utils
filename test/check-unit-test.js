module("Check Unit Test");

test("TestUtils.checkElements", function() {
  var checks = [
    //src, path, check, exactCheck, output
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "d", "e"],
      true, true,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "d"],
      true, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "d", "e", "f"],
      true, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e", "d"],
      true, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e", "d"],
      false, true,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e", "f"],
      false, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e", "d", "f"],
      false, false,
    ],
    [
      [{vara : "a"}, {vara : "b"}, {vara : "c"}, {vara : "d"}, {vara : "e"}],
      "vara",
      ["a", "b", "c", "e"],
      false, false,
    ],
  ];

  var objClass = Ember.Object.extend({
    arr : Utils.hasMany(),
  });
  for(var i = 0; i < checks.length; i++) {
    var obj = objClass.create({arr : checks[i][0]});
    equal(TestUtils.checkElements(obj.get("arr"), checks[i][1], checks[i][2], checks[i][3]), checks[i][4]);
  }
});

test("TestUtils.deepCheck", function() {
  var checks = [
    //srcObj, checkObj, output
    [
      {vara : "a", varb : "b"},
      {vara : "a", varb : "b"},
      true,
    ],
    [
      {vara : "a", varb : "b"},
      {vara : "a", varb : "c"},
      false,
    ],
    [
      {vara : "a", varb : "b", varc : "c"},
      {vara : "a", varb : "b"},
      true,
    ],
    [
      {vara : "a"},
      {vara : "a", varb : "b"},
      false,
    ],
    [
      {vara : "a", varb : [1, 2, 3]},
      {vara : "a", varb : [1, 2, 3]},
      true,
    ],
    [
      {vara : "a", varb : [1, 2, 3]},
      {vara : "a", varb : [1, 4, 3]},
      false,
    ],
    [
      {vara : "a", varb : [1, 2]},
      {vara : "a", varb : [1, 2, 3]},
      false,
    ],
    [
      {vara : "a", varb : [1, 2, 3, 4]},
      {vara : "a", varb : [1, 2, 3]},
      false,
    ],
    [
      {vara : "a", varb : [1, 2, 3], varc : {vard : "d"}},
      {vara : "a", varb : [1, 2, 3], varc : {vard : "d"}},
      true,
    ],
  ];

  for(var i = 0; i < checks.length; i++) {
    equal(TestUtils.deepCheck(checks[i][0], checks[i][1]), checks[i][2]);
  }
  for(var i = 0; i < checks.length; i++) {
    var obj = Ember.Object.create(checks[i][0]);
    equal(TestUtils.deepCheck(obj, checks[i][1]), checks[i][2]);
  }
});
