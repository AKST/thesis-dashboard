import Ember from 'ember';

const Component = Ember.Component.extend({
  localClassNames: ['root'],
  config: null,
})

Component.reopenClass({
  positionalParams: ['config'],
})

export default Component
