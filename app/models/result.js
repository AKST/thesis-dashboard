import DS from 'ember-data';

const { belongsTo, attr, Model } = DS

export default Model.extend({
  fileSize: attr('number'),
  averageTime: attr('number'),
  ghcVersion: attr('semver'),

  script: belongsTo('script'),
  package: belongsTo('package'),
});
