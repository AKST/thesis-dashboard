import Ember from 'ember';

const Component = Ember.Component.extend({
  localClassNames: ['root'],
  label: null,
  data: null,
})

Component.reopenClass({
  positionalParams: ['label', 'data'],
})

export default Component
