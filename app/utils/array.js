import EmObject from 'ember-object'
import get from 'ember-metal/get'


function makeGrouper (groupDescription) {
  if (typeof groupDescription === 'string') {
    return it => get(groupDescription, it)
  }
  else if (typeof groupDescription === 'function') {
    return groupDescription
  }
  else {
    throw new Error('invalid group description')
  }
}


export function groupBy (groupDescription, items) {
  const result = {}
  const grouper = makeGrouper(groupDescription)

  items.forEach(it => {
    const group = grouper(it);

    // create an array if it doesn't already exist
    if (! (group in result)) result[group] = []

    // add item to the group
    result[group].push(it)
  })

  return EmObject.create(result)
}
