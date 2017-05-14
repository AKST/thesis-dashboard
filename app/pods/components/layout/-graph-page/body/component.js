import Ember from 'ember';
import computed from 'ember-computed-decorators'
import injectService from 'ember-service/inject'

import classes from './styles';
import { pallet } from 'ui/utils/color';
import { LinearRange } from 'ui/utils/math/range'

export default Ember.Component.extend({
  localClassNames: ['root'],
  store: injectService('store'),
  classes,

  selectedResultId: null,
  selectedBounds: null,
  currentScript: null,
  groupDescriber: null,
  filtered: null,

  init (...args) {
    this._super(...args)
    this.set('colors', pallet(['0', '5', 'a', 'f']))
  },

  colorPicker (id) {
    return this.get('colors')[id]
  },

  @computed('filtered', 'groupDescriber')
  legend (filtered, groupDescriber) {
    if (groupDescriber == null) return null
    const collected = new Set();
    const legend = [];
    for (const item of filtered.entries) {
      if (collected.has(item.group)) continue;
      const description = this.groupDescriber(item.group)
      const style = Ember.String.htmlSafe(
        `--legend-color: ${this.colorPicker(item.group)}`)
      legend.push({ description, style });
      collected.add(item.group);
    }
    return legend
  },

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
      const xInclusive = ! this.get('showXBounds') || x.containsValue(result.get('fileSize'))
      const yInclusive = ! this.get('showYBounds') || y.containsValue(result.get('averageTime'))
      return (xInclusive && yInclusive) ? result : null
    }
  },
});
