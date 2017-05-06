import Ember from 'ember'
import styles from './styles'

export default Ember.Component.extend({
  localClassNames: ['root'],
  styles,

  config: null,
  _trigger: null,

  didRender (...args) {
    this._super(...args)
    const element = this.get('element')

    // ensures the elements below do not overlap the nodes above.

    let nodeZIndex = element.childElementCount
    for (const node of element.childNodes) {
      if (node.nodeType !== node.ELEMENT_NODE) continue
      node.style.zIndex = nodeZIndex
      nodeZIndex = nodeZIndex - 1
    }
  },

  actions: {
    updateTrigger () {
      this.set('_trigger', Date.now())
    },
  },
});
