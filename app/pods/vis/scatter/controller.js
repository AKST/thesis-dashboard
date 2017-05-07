import Controller from 'ember-controller'
import injectService from 'ember-service/inject'
import styles from './styles'
import get from 'ember-metal/get'
import computed, { observes } from 'ember-computed-decorators'

import { rankSemver } from 'ui/utils/semver'
import { toDataPoints } from 'ui/utils/graph-prep'

const toOptions = (labelKey, valueKey) => (item) => {
  const value = get(item, valueKey)
  const label = get(item, labelKey)
  return { value, label }
}

export default Controller.extend({
  queryParams: ['fileExtension', 'scriptHash', 'packageFilter'],

  store: injectService('store'),

  classes: styles,

  scriptHash: null,
  fileExtension: 'hi',
  packageFilter: null,

  selectedResult: null,
  filteredX: null,
  filteredY: null,

  /*
   * When `model.results` resets the filters for the graph
   * will be inconsistent with the new data so it's best to
   * reset them.
   */
  @observes('model.results')
  resetFilters () {
    this.set('filteredX', null)
    this.set('filteredY', null)
  },

  /*
   * Only needs to be calculate once data is downloaded.
   */
  @computed('model.results')
  normalisedGraphData (items) {
    const x = { source: 'fileSize', description: 'File Size (bytes)' }
    const y = { source: 'averageTime', description: 'Average Time (seconds)' }
    const rank = it => rankSemver(get(it, 'ghcVersion'))
    const grouping = it => it.belongsTo('package').id()
    return toDataPoints(items, x, y, rank, grouping)
  },

  /*
   * Generates a subset of data of normalisedGraphData filtered
   * on constraints defined by the range sliders.
   */
  @computed('normalisedGraphData', 'filteredX', 'filteredY', 'packageFilter')
  filteredGraphData (items, timeFilter, sizeFilter, packageId) {
    const store = this.get('store')

    const predicate = function (it) {
      if (packageId == null) return true

      const fetched = store.peekRecord('result', it.id)
      return fetched.belongsTo('package').id() === packageId
    }

    const cropped = items.intersect(timeFilter, sizeFilter)
    return cropped.filter(predicate)
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
   * Configuration for the size range input.
   */
  @computed('normalisedGraphData')
  sizeRange (normalisedGraphData) {
    const onChange = update => this.set('filteredX', update)
    return { range: normalisedGraphData.bounds.x, onChange }
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
  @computed('scriptSelect', 'fileTypeSelect', 'packageSelect', 'sizeRange', 'timeRange')
  controlConfig (script, fileType, packages, size, time) {
    return { script, fileType, packages, size, time }
  },

  /*
   * The model for the currentScript
   */
  @computed('scriptHash', 'model.scripts')
  currentScript (hash, scripts) {
    return scripts.findBy('id', hash)
  },

  actions: {
    selectDataPoint (id) {
      const result = this.store.peekRecord('result', id)
      this.set('selectedResult', result)
    },
  },
});
