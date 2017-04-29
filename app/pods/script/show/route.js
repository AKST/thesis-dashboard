import Ember from 'ember';

export default Ember.Route.extend({
  model ({ script }) {
    return this.store.findRecord('script', script, { reload: true })
  },
});
