import Ember from 'ember';

const { RSVP, Route } = Ember

export default Route.extend({
  model () {
    return RSVP.hash({
      results: this.store.query('result', { fileExtension: 'hi' }),
      scripts: this.store.findAll('script'),
      packages: this.store.findAll('package'),
      fileTypes: this.store.findAll('filetype'),
    })
  },

  afterModel () {
    this.transitionTo('vis.scatter');
  },
});
