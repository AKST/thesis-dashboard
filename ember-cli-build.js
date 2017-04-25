/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {
    cssModules: {
      plugins: [
        require('postcss-math'),
        require('postcss-cssnext'),
      ],
    },
  });

  return app.toTree();
};
