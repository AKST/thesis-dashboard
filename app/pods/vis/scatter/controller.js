import Ember from 'ember'
import styles from './styles'
import get from 'ember-metal/get'
import computed from 'ember-computed-decorators'

import { rankSemver } from 'ui/utils/semver'
import { calculatePoints } from 'ui/utils/graph-prep'

const toOptions = (labelKey, valueKey) => (item) => {
  const value = get(item, valueKey)
  const label = get(item, labelKey)
  return { value, label }
}

export default Ember.Controller.extend({
  queryParams: ['fileExtension', 'scriptHash'],

  classes: styles,

  scriptHash: null,
  fileExtension: 'hi',

  filteredSize: null,
  filteredTime: null,

  @computed('model.results')
  _results (items) {
    const x = { source: 'fileSize', description: 'File Size (bytes)' }
    const y = { source: 'averageTime', description: 'Average Time (seconds)' }
    const rank = it => rankSemver(get(it, 'ghcVersion'))
    const grouping = it => it.belongsTo('package').id()
    return calculatePoints(items, x, y, rank, grouping)
  },

  @computed('model.scripts')
  scriptSelect (scripts) {
    const options = scripts.sortBy('date').map(toOptions('lastModified', 'id'));
    const update = ({ value }) => this.set('scriptHash', value)
    const description = 'Select a script';
    const initial = options.findBy('value', this.get('scriptHash'))
    return { options, update, description, initial };
  },

  @computed('model.fileTypes')
  fileTypeSelect (fileTypes) {
    const options = fileTypes.map(toOptions('fileType', 'fileType'));
    const update = ({ value }) => this.set('fileExtension', value)
    const description = 'Select a file type';
    const initial = options.findBy('value', this.get('fileExtension'))
    return { options, update, description, initial };
  },

  @computed('_results')
  sizeRange (_results) {
    const onChange = update => this.set('filteredSize', update)
    return { range: _results.bounds.x, onChange }
  },

  @computed('_results')
  timeRange (_results) {
    const onChange = update => this.set('filteredTime', update)
    return { range: _results.bounds.y, onChange }
  },

  @computed('scriptSelect', 'fileTypeSelect', 'sizeRange', 'timeRange')
  controlConfig (script, fileType, size, time) {
    return { script, fileType, size, time }
  },

  @computed('scriptHash', 'model.scripts')
  currentScript (hash, scripts) {
    return scripts.findBy('id', hash)
  },
});
