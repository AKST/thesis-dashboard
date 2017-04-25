import Ember from 'ember';

export default Ember.Component.extend({
  localClassNames: ['root'],

  links: function () {
    return [
      { label: 'home', route: 'index' },
      { label: 'packages', route: 'package.index' },
    ]
  }.property(),
});
