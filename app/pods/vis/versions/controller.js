import Controller from 'ember-controller'
import injectService from 'ember-service/inject'
import computed from 'ember-computed-decorators'
import get from 'ember-metal/get'

import { toDataPoints } from 'ui/utils/graph-prep'

const toOptions = (labelKey, valueKey) => (item) => {
  const value = get(item, valueKey)
  const label = get(item, labelKey)
  return { value, label }
}

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
    fileExtension: 'fext',
    scriptHash: 'hash',
    packageFilter: 'package',
  },

  store: injectService('store'),

  fileExtension: null,
  scriptHash: null,
  packageFilter: null,
  filteredY: null,

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

  /*
   * Generates a subset of data of normalisedGraphData filtered
   * on constraints defined by the range sliders.
   */
  @computed('normalisedGraphData', 'filteredY')
  filteredGraphData (items, timeFilter) {
    return items.intersect(null, timeFilter)
  },

  /*
   * Configuration for the script selector drop down
   */
  @computed('model.scripts')
  scriptSelect (scripts) {
    const options = scripts.sortBy('date').map(toOptions('lastModified', 'id'));
    const update = ({ value }) => this.set('scriptHash', value)
    const description = 'Select a script';
    const initial = options.findBy('value', this.get('scriptHash'))
    return { options, update, description, initial };
  },

  /*
   * Configuration for the package selector
   */
  @computed('model.packages')
  packageSelect (packages) {
    // default option should be at the start
    const options = [{ value: null, label: 'None' }]
      .concat(packages
        .sortBy('name')
        .map(toOptions('name', 'id')))
    const update = ({ value }) => this.set('packageFilter', value)
    const description = 'Select a Package';
    const initial = options.findBy('value', this.get('packageFilter'))
    return { options, update, description, initial };
  },

  /*
   * Configuration for the file type selector drop down
   */
  @computed('model.fileTypes')
  fileTypeSelect (fileTypes) {
    const options = fileTypes.map(toOptions('fileType', 'fileType'));
    const update = ({ value }) => this.set('fileExtension', value)
    const description = 'Select a file type';
    const initial = options.findBy('value', this.get('fileExtension'))
    return { options, update, description, initial };
  },

  /*
   * Configuration for the time range input.
   */
  @computed('normalisedGraphData')
  timeRange (normalisedGraphData) {
    const onChange = update => this.set('filteredY', update)
    return { range: normalisedGraphData.bounds.y, onChange }
  },

  /*
   * Configuration for the combined graph control input
   */
  @computed('scriptSelect', 'fileTypeSelect', 'packageSelect', 'timeRange')
  controlConfig (script, fileType, packages, time) {
    return { script, fileType, packages, time }
  },
});
