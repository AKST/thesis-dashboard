import Ember from 'ember';
import get from 'ember-metal/get';

import { rankSemver } from 'ui/utils/semver'
import { calculatePoints } from 'ui/utils/math'

const toOptions = (labelKey, valueKey) => (item) => {
  const value = get(item, valueKey)
  const label = get(item, labelKey)
  return { value, label }
}

export default Ember.Controller.extend({
  queryParams: ['fileExtension', 'scriptHash'],

  scriptHash: null,
  fileExtension: 'hi',

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
    const initial = options[0]
    return { options, update, description, initial };
  }),

  fileTypeSelect: Ember.computed('model.fileTypes', function () {
    const options = this.get('model.fileTypes').map(toOptions('fileType', 'fileType'));
    const update = ({ value }) => this.set('fileExtension', value)
    const description = 'Select a file type';
    const initial = options.findBy('value', this.get('fileExtension'))
    return { options, update, description, initial };
  }),

  controlConfig: Ember.computed('scriptSelect', 'fileTypeSelect', function () {
    const script = this.get('scriptSelect');
    const fileType = this.get('fileTypeSelect');
    return { script, fileType }
  }),


  currentScript: Ember.computed('scriptHash', function () {
    const scriptHash = this.get('scriptHash')
    const scripts = this.get('model.scripts')
    return scripts.findBy('id', scriptHash)
  }),
});
