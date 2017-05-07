import Ember from 'ember';

const Component = Ember.Component.extend({
  localClassNames: ['root'],
  sep: ' - ',
  range: null,
  title: null,
  truncation: 3,
})

Component.reopenClass({
  positionalParams: ['range'],
})

export default Component
