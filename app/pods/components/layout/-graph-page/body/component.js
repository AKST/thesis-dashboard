import Ember from 'ember';
import computed from 'ember-computed-decorators'
import injectService from 'ember-service/inject'

import classes from './styles';
import { pallet } from 'ui/utils/color';
import { LinearRange } from 'ui/utils/math/range'


function isBlackListed (blacklist, item) {
  if (blacklist == null) return false
  return blacklist.has(item.group.toString())
}

export default Ember.Component.extend({
  localClassNames: ['root'],
  store: injectService('store'),
  classes,

  showLines: true,
  selectedResultId: null,
  selectedBounds: null,
  currentScript: null,
  groupDescriber: null,
  visible: null,
  filtered: null,
  packageBlackList: null,
  togglePackageVisblity: null,

  init (...args) {
    this._super(...args)
    this.set('colors', pallet(['0', '5', 'a', 'f']))
  },

  colorPicker (id) {
    return this.get('colors')[id]
  },

  @computed('filtered', 'groupDescriber', 'packageBlackList')
  legend (filtered, groupDescriber, packageBlackList) {
    if (groupDescriber == null) return null
    const collected = new Set();
    const legend = [];
    for (const item of filtered.entries) {
      if (collected.has(item.group)) continue;
      const description = this.groupDescriber(item.group)
      const _classes = isBlackListed(packageBlackList, item)
        ? classes.legendDisabled
        : classes.legendEnabled

      const style = Ember.String.htmlSafe(
        `--legend-color: ${this.colorPicker(item.group)}`)
      legend.push({ description, style, classes: _classes, group: item.group });
      collected.add(item.group);
    }
    return legend
  },

  @computed('filtered')
  showXBounds (filtered) {
    return filtered.bounds.x instanceof LinearRange;
  },

  @computed('filtered')
  slahowYBounds (filtered) {
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
