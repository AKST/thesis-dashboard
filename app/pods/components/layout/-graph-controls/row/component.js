import Ember from 'ember'

const Component = Ember.Component.extend({
  localClassNames: ['root'],
  attributeBindings: ['_isRow:data-is-row'],
  config: null,
  _isRow: true,

  onResize: null,

  didRender (...args) {
    this._super(...args);

    const element = this.get('element')
    const childMaxWidth = 100 / element.childElementCount

    for (const node of element.childNodes) {
      if (node.nodeType !== node.ELEMENT_NODE) continue
      node.style.maxWidth = `${childMaxWidth}%`
    }
  }
})

Component.reopenClass({
  positionalParams: ['config'],
})

export default Component
