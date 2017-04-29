import get from 'ember-metal/get'
import Ember from 'ember'


export const T = Ember.Object.extend(Ember.Comparable, {
  major: null,
  minor: null,
  patch: null,

  toString() {
    const { major, minor, patch } = this.getProperties('major', 'minor', 'patch')
    return `${major}.${minor}.${patch}`
  },

  compare (other) {
    return compare(this, other)
  },
})

export function compare (a, b) {
  const aMaj = get(a, 'major')
  const bMaj = get(b, 'major')
  if (aMaj > bMaj) return 1
  else if (aMaj < bMaj) return -1
  else {
    const aMin = get(a, 'minor')
    const bMin = get(b, 'minor')
    if (aMin > bMin) return 1
    else if (aMin < bMin) return -1
    else {
      const aPat = get(a, 'patch')
      const bPat = get(b, 'patch')
      if (aPat > bPat) return 1
      else if (aPat < bPat) return -1
      else return 0
    }
  }
}

export function rankSemver (version) {
  const range = 8
  const { major, minor } = version.getProperties('major', 'minor')
  if (major === 8) return 1
  if (minor >= 10) return 1 * ((range - 1) / range)
  if (minor >= 8) return 1 * ((range - 2) / range)
  if (minor >= 6) return 1 * ((range - 3) /range)
  if (minor >= 4) return 1 * ((range - 4) /range)
  if (minor >= 2) return 1 * ((range - 5) /range)
  if (minor >= 0) return 1 * ((range - 6) /range)
  return 1
}

export function deserialize (raw) {
  const [major, minor, patch] = raw.split('.')
  return T.create({ major, minor, patch })
}

export default T
