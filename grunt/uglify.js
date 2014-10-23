module.exports = {
  dist: {
    options : {
      mangle : {
        except: ["jQuery", "Ember", "Em", "DS"],
      },
    },
    files: {
      "dist/ember-test-utils.min.js": "dist/ember-test-utils.js",
    }
  }
};

