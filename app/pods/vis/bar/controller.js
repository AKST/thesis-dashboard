import Ember from 'ember';
import get from 'ember-metal/get'
import computed from 'ember-computed-decorators'

import { rankSemver } from 'ui/utils/semver'
import { toDataPoints } from 'ui/utils/graph-prep'

export default Ember.Controller.extend({
  queryParams: {
    fileExtension: 'fext',
    scriptHash: 'hash',
  },

  fileExtension: null,
  scriptHash: null,

  @computed('model.results')
  normalisedGraphData (items) {
    const x = { source: 'fileSize', description: 'File Size (bytes)' }
    const y = { source: 'averageTime', description: 'Average Time (seconds)' }
    const rank = it => rankSemver(get(it, 'ghcVersion'))
    const grouping = it => it.belongsTo('package').id()
    return toDataPoints(items, x, y, rank, grouping)
  },

  @computed('model', 'normalisedGraphData')
  data (model, results) {
    // i know this is redudant but I'm just being explit right now
    return Ember.Object.create({
      results,
      scripts: get(model, 'scripts'),
      packages: get(model, 'packages'),
      fileTypes: get(model, 'fileTypes'),
    })
  },
});
