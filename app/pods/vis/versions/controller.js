import EmObject from 'ember-object'
import Controller from 'ember-controller'
import injectService from 'ember-service/inject'
import computed from 'ember-computed-decorators'
import get from 'ember-metal/get'

import { getRange } from 'ui/utils/semver/ghc'
import { toDataPoints } from 'ui/utils/graph-prep'


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

    const xConfig = {
      source: project,
      description: 'GHC Release',
      ordinalRange: getRange(),
    }

    const yConfig = {
      source: 'averageTime',
      description: 'Average Time (seconds)',
    }

    const group = it => it.belongsTo('package').id()

    if (packageId == null) {
      const normalised = toDataPoints(items, xConfig, yConfig, null, group)
      normalised.bounds.y.acknowledge(0)
      return normalised
    }
    else {
      const filtered = items
        .filter(it => it.belongsTo('package').id() === packageId)
      return toDataPoints(filtered, xConfig, yConfig, null, group)
    }
  },

  @computed('model', 'normalisedGraphData')
  data (model, results) {
    // i know this is redudant but I'm just being explit right now
    return EmObject.create({
      results,
      scripts: get(model, 'scripts'),
      packages: get(model, 'packages'),
      fileTypes: get(model, 'fileTypes'),
    })
  },
});
