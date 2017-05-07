import Ember from 'ember';

/**
 * The whole point of this route is to redirect.
 */
export default Ember.Route.extend({
  afterModel () {
    this.transitionTo('vis.scatter')
  },
});
