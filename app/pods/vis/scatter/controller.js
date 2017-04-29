import Ember from 'ember'
import styles from './styles'
import get from 'ember-metal/get'

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

  _results: Ember.computed('model.results', function onResults () {
    const items = this.get('model.results')
    const x = { source: 'fileSize', description: 'File Size (bytes)' }
    const y = { source: 'averageTime', description: 'Average Time (seconds)' }
    const rank = it => rankSemver(get(it, 'ghcVersion'))
    const grouping = it => it.belongsTo('package').id()
    return calculatePoints(items, x, y, rank, grouping)
  }),

  scriptSelect: Ember.computed('model.scripts', function () {
    const options = this.get('model.scripts')
      .sortBy('date')
      .map(toOptions('lastModified', 'id'));
    const update = ({ value }) => this.set('scriptHash', value)
    const description = 'Select a script';
    const initial = options.findBy('value', this.get('scriptHash'))
    return { options, update, description, initial };
  }),

  fileTypeSelect: Ember.computed('model.fileTypes', function () {
    const options = this.get('model.fileTypes').map(toOptions('fileType', 'fileType'));
    const update = ({ value }) => this.set('fileExtension', value)
    const description = 'Select a file type';
    const initial = options.findBy('value', this.get('fileExtension'))
    return { options, update, description, initial };
  }),

  sizeRange: Ember.computed('_results', function () {
    const onChange = update => this.set('filteredSize', update)
    return { range: this.get('_results').bounds.x, onChange }
  }),

  timeRange: Ember.computed('_results', function () {
    const onChange = update => this.set('filteredTime', update)
    return { range: this.get('_results').bounds.y, onChange }
  }),

  controlConfig: Ember.computed('scriptSelect', 'fileTypeSelect', 'sizeRange', 'timeRange', function () {
    const script = this.get('scriptSelect');
    const fileType = this.get('fileTypeSelect');
    const size = this.get('sizeRange');
    const time = this.get('timeRange');
    return { script, fileType, size, time }
  }),

  currentScript: Ember.computed('scriptHash', function () {
    const scriptHash = this.get('scriptHash')
    const scripts = this.get('model.scripts')
    return scripts.findBy('id', scriptHash)
  }),
});
