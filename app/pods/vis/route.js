import Ember from 'ember'

const { RSVP, Route } = Ember

export default Route.extend({
  model () {
    return RSVP.hash({
      scripts: this.store.findAll('script'),
      packages: this.store.findAll('package'),
      fileTypes: this.store.findAll('filetype'),
    })
  },
});
