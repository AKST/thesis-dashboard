import Ember from 'ember';
import get from 'ember-metal/get';

const toOptions = (labelKey, valueKey) => (item) => {
  const value = get(item, valueKey)
  const label = get(item, labelKey)
  return { value, label }
}

export default Ember.Controller.extend({
  _script: null,
  _fileType: null,

  bounds: Ember.computed('model.results', function () {
    console.log(this.get('model.results'));
  }),

  scriptSelect: Ember.computed('model.scripts', function () {
    const options = this.get('model.scripts').map(toOptions('lastModified', 'id'));
    const update = value => this.set('_script', value)
    const description = 'Select a script';
    const initial = options[0]
    return { options, update, description, initial };
  }),

  fileTypeSelect: Ember.computed('model.fileTypes', function () {
    const options = this.get('model.fileTypes').map(toOptions('fileType', 'fileType'));
    const update = value => this.set('_fileType', value)
    const description = 'Select a file type';
    const initial = options.findBy('value', 'hi')
    return { options, update, description, initial };
  }),

  controlConfig: Ember.computed('scriptSelect', 'fileTypeSelect', function () {
    const script = this.get('scriptSelect');
    const fileType = this.get('fileTypeSelect');
    return { script, fileType }
  }),
});
