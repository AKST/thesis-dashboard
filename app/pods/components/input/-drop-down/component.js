import get from 'ember-metal/get'
import Ember from 'ember'
import styles from './styles'

import { checkKeyThenConf } from 'ui/utils/init'

const Component = Ember.Component.extend({
  localClassNames: ['root'],

  // public API
  config: null,
  options: null,
  initial: null,
  description: null,

  _showOptions: false,
  _selected: null,

  init (...args) {
    this._super(...args);
    const initial = get(this, 'config.initial') || get(this, 'initial')
    if (initial != null) {
      this.set('_selected', initial)
    }
  },

  _update: Ember.computed('config.update', 'update', function () {
    const _default = function () {}
    return checkKeyThenConf(this, 'update', _default)
  }),

  _options: Ember.computed('config.options', 'options', function () {
    return checkKeyThenConf(this, 'options', [])
  }),

  _description: Ember.computed('config.description', 'description', '_selected', function () {
    const selected = this.get('_selected')
    if (selected != null) return get(selected, 'label')
    return checkKeyThenConf(this, 'description', 'Select a value')
  }),

  mouseEnter () {
    const [options] = this.element.getElementsByClassName(styles.options);
    options.classList.add(styles['options--visible']);
  },

  mouseLeave () {
    const [options] = this.element.getElementsByClassName(styles.options);
    options.classList.remove(styles['options--visible']);
  },

  actions: {
    update (option) {
      this.set('_selected', option)
      this.get('_update')(option)
    },
  },
})

Component.reopenClass({
  positionalParams: ['config'],
})

export default Component
