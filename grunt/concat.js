module.exports = {
  dist : {
    files : {
      "dist/ember-test-utils.js" : [
        "src/js/test-utils.js",
        "src/js/test-init.js",
        "src/js/test-case-base.js",
        "src/js/test-case-operations.js",
        "src/js/test-mockapis-wrapper.js",
      ],
    },
  },
  test : {
    files : {
      "test/tests-merged.js" : [
        "test/test-init.js",
        "test/getter-unit-test.js",
        "test/setter-unit-test.js",
        "test/test-suit-unit-test.js",
        "test/test-case-unit-test.js",
        "test/test-case-operation-unit-test.js",
      ],
    },
  },
};
