import Component from 'ember-component'
import computed from 'ember-computed-decorators'
import styles from './styles'

export default Component.extend({
  localClassNames: ['root'],

  value: null,
  label: null,
  onToggle: null,
  config: null,

  @computed('config', 'value')
  _value (config, value) {
    return config != null ? config.value : value
  },

  @computed('config', 'label')
  _label (config, label) {
    return config != null ? config.label : label
  },

  @computed('config', 'onToggle')
  _onToggle (config, onToggle) {
    return config != null ? config.onToggle : onToggle
  },

  @computed('_value')
  btnClass (value) {

    return value ? styles.activeButton : styles.inactiveButton
  },

  actions: {
    onClick () {
      const callback = this.get('_onToggle')
      if (callback != null) callback()
    },
  },
}).reopenClass({
  positionalParams: ['config'],
});
