import injectService from 'ember-service/inject'
import Route from 'ember-route'
import RSVP from 'rsvp'
import get from 'ember-metal/get'


export default Route.extend({
  router: injectService('router'),

  model () {
    return RSVP.hash({
      scripts: this.store.findAll('script'),
      packages: this.store.findAll('package'),
      fileTypes: this.store.findAll('filetype'),
    })
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
    const parent = this.modelFor('vis')
    if (scriptHash == null) {
      const scriptHash = get(parent.scripts.objectAt(0), 'id')
      return this.transitionTo({ queryParams: { scriptHash, fileExtension } })
    }
    else if (fileExtension == null) {
      return this.transitionTo({ queryParams: { scriptHash, fileExtension: 'hi' } })
    }

    const results = this.store.query('result', { fileExtension, scriptHash })
    return results.then(results => Object.assign({}, parent, { results }))
  }

  return { queryParams, model }
}
