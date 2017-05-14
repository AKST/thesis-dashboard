import Controller from 'ember-controller'
import injectService from 'ember-service/inject'
import computed from 'ember-computed-decorators'
import get from 'ember-metal/get'

import { toDataPoints } from 'ui/utils/graph-prep'

const ghcVersionRange = [
  '7.0.4',
  '7.2.2',
  '7.4.2',
  '7.6.3',
  '7.8.4',
  '7.10.3',
  '8.0.1',
]

export default Controller.extend({
  queryParams: {
    scriptHash: 'hash',
    packageFilter: 'package',
    selectedResultId: 'focus',
  },

  store: injectService('store'),

  selectedResultId: null,
  scriptHash: null,
  packageFilter: null,
  filteredY: null,

  groupDescriber (groupId) {
    return this.get('store').peekRecord('package', groupId).get('name')
  },

  @computed('model.results', 'packageFilter')
  normalisedGraphData (items, packageId) {
    const project = it => {
      const result = this.store.peekRecord('result', it.id)
      return result.get('ghcVersion').toString();
    }

    const x = { source: project, description: 'GHC Release', ordinalRange: ghcVersionRange }
    const y = { source: 'averageTime', description: 'Average Time (seconds)' }
    const group = it => it.belongsTo('package').id()
    const filtered = packageId == null ? items
      : items.filter(it => it.belongsTo('package').id() === packageId)

    return toDataPoints(filtered, x, y, null, group)
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
