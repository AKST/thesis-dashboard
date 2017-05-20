import Component from 'ember-component'
import get from 'ember-metal/get'
import computed, { observes } from 'ember-computed-decorators'

import Immutable from 'npm:immutable'

import classes from './styles'
import { getRange } from 'ui/utils/semver/ghc'


const toOptions = (labelKey, valueKey) => (item) => {
  const value = get(item, valueKey)
  const label = get(item, labelKey)
  return { value, label }
}


export default Component.extend({
  localClassNames: ['root'],
  classes,

  _data: null,

  ////////////////////////////////////////////////////////////////////////////////////////
  // PUBLIC API                                                                         //
  ////////////////////////////////////////////////////////////////////////////////////////

  showLines: true,
  selectedResultId: null,
  ghcVersionFilter: null,
  packageFilter: null,
  fileExtension: null,
  scriptHash: null,
  togglePackage: null,

  ////////////////////////////////////////////////////////////////////////////////////////
  // FILTER VALUES                                                                      //
  ////////////////////////////////////////////////////////////////////////////////////////

  filteredX: null,
  filteredY: null,
  packageBlackList: null,

  ////////////////////////////////////////////////////////////////////////////////////////
  // OBSERVERS                                                                          //
  ////////////////////////////////////////////////////////////////////////////////////////

  init (...args) {
    this._super(...args);
    this.set('packageBlackList', Immutable.Set());
  },

  /*
   * When `model.results` resets the filters for the graph
   * will be inconsistent with the new data so it's best to
   * reset them.
   */
  @observes('_data.results')
  resetFilters () {
    this.set('filteredX', null)
    this.set('filteredY', null)
  },

  ////////////////////////////////////////////////////////////////////////////////////////
  // COMPUTED PROPERTIES                                                                //
  ////////////////////////////////////////////////////////////////////////////////////////

  @computed('_data.results', 'filteredX', 'filteredY')
  _filtered (items, timeFilter, sizeFilter) {
    return items.intersect(timeFilter, sizeFilter)
  },

  @computed('_filtered', 'filteredY', 'filteredX')
  _selectedBounds (filteredGraphData, filteredY, filteredX) {
    const x = filteredX != null ? filteredX : filteredGraphData.bounds.x
    const y = filteredY != null ? filteredY : filteredGraphData.bounds.y
    return { x, y }
  },

  /*
   * Configuration for the script selector drop down
   */
  @computed('_data.scripts')
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
  @computed('_data.packages', 'packageBlackList')
  packageSelect (packages, blacklist) {
    // default option should be at the start
    const options = [{ value: null, label: 'None' }]
      .concat(packages.filter(it => ! blacklist.has(it.get('id')))
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
  @computed()
  ghcSelect () {
    const options = [{ value: null, label: 'None' }]
      .concat(getRange().map(it => ({ value: it, label: it })))

    const update = ({ value }) => this.set('ghcVersionFilter', value)
    const description = 'Select a GHC Version';
    const initial = options.findBy('value', this.get('ghcVersionFilter'))
    return { options, update, description, initial }
  },

  /*
   * Configuration for the file type selector drop down
   */
  @computed('_data.fileTypes')
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
  @computed('_data.results', 'packageFilter')
  sizeRange (normalisedGraphData) {
    // while packageFilter is not used in this function, we
    // recompute on that to reset the range.
    const onChange = update => this.set('filteredX', update)
    const clone = normalisedGraphData.bounds.x.clone();
    return { range: clone, onChange }
  },

  /*
   * Configuration for the time range input.
   */
  @computed('_data.results', 'packageFilter')
  timeRange (normalisedGraphData) {
    // while packageFilter is not used in this function, we
    // recompute on that to reset the range.
    const onChange = update => this.set('filteredY', update)
    return { range: normalisedGraphData.bounds.y, onChange }
  },

  /*
   * Configuration for showing the lines in the graph
   */
  @computed('showLines')
  showLinesSelect (value) {
    const onToggle = () => this.toggleProperty('showLines')
    const label = "Show lines"
    return { label, value, onToggle }
  },

  @computed(
    'scriptSelect',
    'fileTypeSelect',
    'packageSelect',
    'sizeRange',
    'timeRange',
    'ghcSelect',
    'showLinesSelect',
  )
  _controlConfig (script, fileType, packages, size, time, ghc, lines) {
    return { script, fileType, packages, size, time, ghc, lines }
  },

  /*
   * The model for the currentScript
   */
  @computed('scriptHash', '_data.scripts')
  currentScript (hash, scripts) {
    return scripts.findBy('id', hash)
  },

  actions: {
    togglePackageVisblity (packageId) {
      const blacklist = this.get('packageBlackList')
      const update = blacklist.has(packageId)
        ? blacklist.delete(packageId)
        : blacklist.add(packageId)
      this.set('packageBlackList', update);
    },
  },
}).reopenClass({
  positionalParams: ['_data'],
})
