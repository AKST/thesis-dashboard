import Ember from 'ember'
import get from 'ember-metal/get'

const { RSVP, Route } = Ember

export default Route.extend({
  queryParams: {
    fileExtension: { refreshModel: true },
    scriptHash: { refreshModel: true },
  },

  model ({ fileExtension, scriptHash }) {
    if (scriptHash == null) {
      const parent = this.modelFor('vis')
      const scriptHash = parent.scripts.objectAt(0).get('id')
      return this.transitionTo({ queryParams: { scriptHash } })
    }
    const parent = this.modelFor('vis')
    const results = this.store.query('result', { fileExtension, scriptHash })
    return results.then(results => Object.assign({}, parent, { results }))
  },
});
