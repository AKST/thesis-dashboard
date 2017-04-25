import DS from 'ember-data';

const { attr, Model } = DS

export default Model.extend({
  name: attr('string'),
  minGhc: attr('semver'),
  maxGhc: attr('semver'),
  repoUrl: attr('string'),
  commitHash: attr('string'),
});
