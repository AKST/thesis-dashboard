import EmObject from 'ember-object'
import get from 'ember-metal/get'


function makeGrouper (groupDescription) {
  if (typeof groupDescription === 'string') {
    return it => get(it, groupDescription)
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

export function shuffle(input) {
  let temporaryValue
  let randomIndex
  let currentIndex = input.length
  const output = [...input]

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = output[currentIndex]
    output[currentIndex] = output[randomIndex]
    output[randomIndex] = temporaryValue
  }

  return output
}
