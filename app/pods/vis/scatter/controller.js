import Ember from 'ember';
import get from 'ember-metal/get'
import computed from 'ember-computed-decorators'
import injectService from 'ember-service/inject'

import { rankSemver } from 'ui/utils/semver'
import { toDataPoints } from 'ui/utils/graph-prep'

export default Ember.Controller.extend({
  queryParams: {
    fileExtension: 'fext',
    scriptHash: 'hash',
    ghcVersion: 'ghcVersion',
    packageFilter: 'package',
    selectedResultId: 'focus',
  },

  store: injectService('store'),

  scriptHash: null,
  ghcVersion: null,
  fileExtension: 'hi',
  packageFilter: null,
  selectedResultId: null,

  groupDescriber (groupId) {
    return this.store.peekRecord('package', groupId).get('name')
  },

  /*
   * Only needs to be calculate once data is downloaded.
   */
  @computed('model.results', 'packageFilter', 'ghcVersion')
  normalisedGraphData (items, packageId, ghcVersion) {
    const xConfig = { source: 'fileSize', description: 'File Size (bytes)' }
    const yConfig = { source: 'averageTime', description: 'Avg Time (seconds)' }
    const rank = it => rankSemver(get(it, 'ghcVersion'))
    const grouping = it => it.belongsTo('package').id()

    const filtered = items
      .filter(it => !packageId || it.belongsTo('package').id() === packageId)
      .filter(it => !ghcVersion || it.get('ghcVersion').toString() === ghcVersion)
    const normalised = toDataPoints(filtered, xConfig, yConfig, rank, grouping)

    if (packageId == null) {
      const { x, y } = normalised.bounds
      x.acknowledge(0)
      y.acknowledge(0)
    }

    return normalised;
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
