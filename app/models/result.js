import Model from 'ember-data/model'
import attr from 'ember-data/attr'
import { belongsTo } from 'ember-data/relationships'


export default Model.extend({
  fileSize: attr('number'),
  averageTime: attr('number'),
  ghcVersion: attr('semver'),

  script: belongsTo('script'),
  package: belongsTo('package'),
})
