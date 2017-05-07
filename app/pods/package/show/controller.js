import Ember from 'ember';

export default Ember.Controller.extend({
  properties: Ember.computed('model', function () {
    return [
      { label: "Package name", key: 'name' },
      { label: "Max GHC compat", key: 'maxGhc' },
      { label: "Min GHC compat", key: 'minGhc' },
      { label: "Git Url", key: 'repoUrl' },
      { label: "Git Commit hash", key: 'commitHash' },
    ]
  }),
});
