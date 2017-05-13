import Ember from 'ember';
import computed from 'ember-computed-decorators'
import injectService from 'ember-service/inject'

export default Ember.Component.extend({
  store: injectService('store'),

  localClassNames: ['root'],
  selectedResultId: null,
  selectedBounds: null,
  currentScript: null,
  filtered: null,

  @computed('selectedResultId', 'selectedBounds')
  selectedResult (id, { x, y }) {
    const result = this.get('store').peekRecord('result', id);
    if (result != null) {
      const xInclusive = x.containsValue(result.get('fileSize'))
      const yInclusive = y.containsValue(result.get('averageTime'))
      return (xInclusive && yInclusive) ? result : null
    }
  },
});
