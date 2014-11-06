module.exports = {
  compile : {
    options : {
      baseUrl : "src/js",
      dir : "build",
      mainConfigFile : "src/js/test-config.js",

      fileExclusionRegExp : /^(?:\.|_)/,
      findNestedDependencies : true,
      skipDirOptimize : true,
      removeCombined : true,
      optimize : "none",
      wrap : true,

      modules : [
        {
          name : "main",
          exclude : [
            "jquery",
            "jquery_mockjax",
            "handlebars",
            "ember",
            //"lib/ember-utils-core",
          ],
          insertRequire : ["main"],
        }
      ],
    },
  },
};
