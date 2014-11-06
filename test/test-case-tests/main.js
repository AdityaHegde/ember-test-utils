define([
  "./test-suit",
  "./test-case",
  "./operations",
], function() {
  var testSuits = arguments;
  return function() {
    for(var i = 0; i < testSuits.length; i++) {
      testSuits[i]();
    }
  };
});
