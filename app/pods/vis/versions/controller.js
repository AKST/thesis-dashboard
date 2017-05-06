import Controller from 'ember-controller'
import Ember from 'ember';
import { observes } from 'ember-computed-decorators'

import { groupBy } from 'ui/utils/array'

export default Controller.extend({
  queryParams: ['fileExtension', 'scriptHash'],

  @observes('model.results')
  readResults () {
    const group = it => it.get('ghcVersion').toString()
    console.log(groupBy(group, this.get('model.results')))
  },
});
