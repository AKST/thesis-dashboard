import Route from 'ember-route'
import RSVP from 'rsvp'
import get from 'ember-metal/get'


export default Route.extend({
  model () {
    return RSVP.hash({
      scripts: this.store.findAll('script'),
      packages: this.store.findAll('package'),
      fileTypes: this.store.findAll('filetype'),
    })
  },

  afterModel () {
    this.transitionTo('vis.scatter')
  },
})

/**
 * Since all child route of this are kind of the same
 * we'll make this factory method that defines some
 * default properties of it here.
 */
export function makeChildRoute () {
  const queryParams = {
    fileExtension: { refreshModel: true },
    scriptHash: { refreshModel: true },
  }

  const model = function ({ fileExtension, scriptHash }) {
    if (scriptHash == null) {
      const parent = this.modelFor('vis')
      const scriptHash = get(parent.scripts.objectAt(0), 'id')
      return this.transitionTo({ queryParams: { scriptHash } })
    }
    const parent = this.modelFor('vis')
    const results = this.store.query('result', { fileExtension, scriptHash })
    return results.then(results => Object.assign({}, parent, { results }))
  }

  return { queryParams, model }
}
