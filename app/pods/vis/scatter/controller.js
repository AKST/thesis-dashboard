import Ember from 'ember';
import get from 'ember-metal/get'
import computed from 'ember-computed-decorators'

import { rankSemver } from 'ui/utils/semver'
import { toDataPoints } from 'ui/utils/graph-prep'

export default Ember.Controller.extend({
  queryParams: {
    fileExtension: 'fext',
    scriptHash: 'hash',
    packageFilter: 'package',
    selectedResultId: 'focus',
  },

  scriptHash: null,
  fileExtension: 'hi',
  packageFilter: null,
  selectedResultId: null,

  /*
   * Only needs to be calculate once data is downloaded.
   */
  @computed('model.results', 'packageFilter')
  normalisedGraphData (items, packageId) {
    const x = { source: 'fileSize', description: 'File Size (bytes)' }
    const y = { source: 'averageTime', description: 'Average Time (seconds)' }
    const rank = it => rankSemver(get(it, 'ghcVersion'))
    const grouping = it => it.belongsTo('package').id()
    const filtered = packageId == null ? items
      : items.filter(it => it.belongsTo('package').id() === packageId)
    console.log(filtered);
    return toDataPoints(filtered, x, y, rank, grouping)
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
