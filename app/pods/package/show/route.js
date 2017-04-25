import Ember from 'ember';

export default Ember.Route.extend({
  model ({ package: p } = {}) {
    return this.store.find('package', p);
  },
});
