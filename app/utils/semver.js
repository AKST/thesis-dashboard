import Ember from 'ember'

export const T = Ember.Object.extend({
  major: null,
  minor: null,
  patch: null,

  toString() {
    const { major, minor, patch } = this.getProperties('major', 'minor', 'patch')
    return `${major}.${minor}.${patch}`
  },
})

export function deserialize(raw) {
  const [major, minor, patch] = raw.split('.')
  return T.create({ major, minor, patch })
}

export default T
