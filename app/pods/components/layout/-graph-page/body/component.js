import Ember from 'ember';
import computed from 'ember-computed-decorators'
import injectService from 'ember-service/inject'

import { LinearRange } from 'ui/utils/math/range'

export default Ember.Component.extend({
  store: injectService('store'),

  localClassNames: ['root'],
  selectedResultId: null,
  selectedBounds: null,
  currentScript: null,
  filtered: null,

  @computed('filtered')
  showXBounds (filtered) {
    return filtered.bounds.x instanceof LinearRange;
  },

  @computed('filtered')
  showYBounds (filtered) {
    return filtered.bounds.y instanceof LinearRange;
  },

  @computed('selectedResultId', 'filtered')
  selectedResult (id, filtered) {
    const result = this.get('store').peekRecord('result', id);
    if (result != null) {
      const { x, y } = filtered.bounds
      const xInclusive = this.get('showXBounds') ? x.containsValue(result.get('fileSize')) : true
      const yInclusive = this.get('showYBounds') ? y.containsValue(result.get('averageTime')) : true
      console.log(xInclusive, yInclusive);
      return (xInclusive && yInclusive) ? result : null
    }
  },
});
