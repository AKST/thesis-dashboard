import Ember from 'ember'

export default Ember.Component.extend({
  localClassNames: ['root'],

  links: Ember.computed(function () {
    return [
      { label: 'Home', route: 'index' },
      { label: 'Packages', route: 'package.index' },
      { label: 'Scripts', route: 'script.index' },
    ]
  }),
});
