import Ember from 'ember'
import get from 'ember-metal/get'

const { RSVP, Route } = Ember

export default Route.extend({
  queryParams: {
    fileExtension: { refreshModel: true },
    scriptHash: { refreshModel: true },
  },

  model ({ fileExtension, scriptHash: hash }) {
    const parent = this.modelFor('vis')
    const scriptHash = hash ? hash : get(parent, 'scripts.0.id')
    const results = this.store.query('result', { fileExtension, scriptHash })
    return results.then(results => Object.assign({}, parent, { results }))
  },
});
