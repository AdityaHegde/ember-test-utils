module.exports = {
  options : {
    coverage : {
      disposeCollector : true,
      src : ["src/js/test-utils/*.js", "src/js/test-case/*.js", "src/js/test-case/test-case-operations/*.js", "src/js/mockjax-utils/*.js"],
      instrumentedFiles : "tmp",
      lcovReport : "coverage",
    },
  },

  all : [
    "unit_test.html",
  ],
};
