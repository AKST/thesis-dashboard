import get from 'ember-metal/get'
import Range from 'ui/utils/math/range'


export class NormalisedArray {
  constructor (x, y) {
    this._entries = []
    this._xRange = x
    this._yRange = y
    this._hasData = false;
  }

  get hasData () {
    return this._hasData;
  }

  get entries () {
    return this._entries
  }

  get bounds () {
    return { x: this._xRange, y: this._yRange }
  }

  get lines () {
    return makeLines(this._entries)
  }

  filter (predicate) {
    const x = this._xRange.freshCopy()
    const y = this._yRange.freshCopy()
    const instance = new NormalisedArray(x, y)

    for (const item of this._entries.filter(predicate)) {
      instance._insert(item)
      x.acknowledge(item.x)
      y.acknowledge(item.y)
    }

    return instance
  }

  intersect (x, y) {
    const newX = this._xRange.refine(x)
    const newY = this._yRange.refine(y)
    const intersection = new NormalisedArray(newX, newY)
    const filter = it => newX.containsValue(it.x) && newY.containsValue(it.y)
    intersection._entries = this._entries.filter(filter)
    intersection._hasData = intersection._entries.length > 0
    return intersection
  }

  intersectY (range) {
    const intersection = new NormalisedArray(this._xRange, range)
    intersection._entries = this._entries.filter(it => range.containsValue(it.y))
    return intersection
  }

  _insert (item) {
    this._hasData = true;
    this._entries.push(item)
    this._xRange.acknowledge(item.x)
    this._yRange.acknowledge(item.y)
  }
}

export function makeLines (sourceData) {
  function compareRank (a, b) {
    if (a.rank > b.rank) return 1
    else if (a.rank < b.rank) return 1
    else return 0
  }

  function groupFold (groups, item) {
    const groupId = get(item, 'group')
    if (! (groupId in groups)) groups[groupId] = []
    groups[groupId].push(item)
    return groups
  }

  return Object.values(sourceData.reduce(groupFold, {}))
    .map(line => line.sort(compareRank))
}


export function toDataPoints (sourceData, xConf, yConf, _ranker, getGroupId) {
  function fieldFactory (descriptor) {
    if (typeof descriptor === 'function') return descriptor;
    if (typeof descriptor === 'string') return it => get(it, descriptor)
    throw new TypeError("invalid field descriptor");
  }

  const ranker = _ranker != null ? _ranker : (() => 1)
  const xField = fieldFactory(xConf.source);
  const yField = fieldFactory(yConf.source);
  const outData = new NormalisedArray(
    Range.create(xConf.description, xConf.ordinalRange),
    Range.create(yConf.description, yConf.ordinalRange))

  sourceData.forEach(item => {
    const id = get(item, 'id')
    const x = xField(item);
    const y = yField(item);
    const rank = ranker(item)
    const group = getGroupId(item)
    outData._insert({ id, x, y, rank, group })
  })

  return outData
}
