import Ember from 'ember';

export default Ember.Controller.extend({
  properties: [
    { label: "Max GHC compat", key: 'maxGhc' },
    { label: "Min GHC compat", key: 'minGhc' },
    { label: "Git Url", key: 'repoUrl' },
    { label: "Git Commit hash", key: 'commitHash' },
  ],
});
