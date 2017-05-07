import get from 'ember-metal/get'

export class Range {
  constructor (field, description) {
    this.min = Infinity
    this.max = -Infinity
    this._field = field
    this.description = description
  }

  containsValue (value) {
    if (value > this.max) return false
    if (value < this.min) return false
    return true
  }

  update (item) {
    const next = get(item, this._field)
    this.updateRaw(next)
    return next
  }

  updateRaw (value) {
    if (value < this.min) this.min = value
    if (value > this.max) this.max = value
  }

  refine (other) {
    if (other == null) return this
    const copy = new Range(this._field, this.description)
    copy.min = Math.max(this.min, other.min)
    copy.max = Math.min(this.max, other.max)
    return copy
  }

  intersectPercentage (min, max) {
    const copy = this._freshCopy()
    copy.min = this.min + (this.difference * min)
    copy.max = this.min + (this.difference * max)
    return copy
  }

  get difference () {
    return this.max - this.min
  }

  _freshCopy () {
    return new Range(this._field, this.description)
  }
}

export class NormalisedArray {
  constructor (x, y) {
    this._entries = []
    this._x = x
    this._y = y
    this._hasData = false;
  }

  get hasData () {
    return this._hasData;
  }

  get entries () {
    return this._entries
  }

  get bounds () {
    return { x: this._x, y: this._y }
  }

  get lines () {
    return makeLines(this._entries)
  }

  filter (predicate) {
    const x = this._x._freshCopy()
    const y = this._y._freshCopy()
    const instance = new NormalisedArray(x, y)

    for (const item of this._entries.filter(predicate)) {
      instance._insert(item)
      x.updateRaw(item.x)
      y.updateRaw(item.y)
    }

    return instance
  }

  intersect (x, y) {
    const newX = this._x.refine(x)
    const newY = this._y.refine(y)
    const intersection = new NormalisedArray(newX, newY)
    const filter = it => newX.containsValue(it.x) && newY.containsValue(it.y)
    intersection._entries = this._entries.filter(filter)
    intersection._hasData = intersection._entries.length > 0
    return intersection
  }

  intersectY (range) {
    const intersection = new NormalisedArray(this._x, range)
    intersection._entries = this._entries.filter(it => range.containsValue(it.y))
    return intersection
  }

  _insert (item) {
    this._hasData = true;
    this._entries.push(item)
    this._x.update(item)
    this._y.update(item)
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

export function toDataPoints (sourceData, xConf, yConf, ranker, getGroupId) {
  const xRange = new Range(xConf.source, xConf.description)
  const yRange = new Range(yConf.source, yConf.description)
  const outData = new NormalisedArray(xRange, yRange)

  sourceData.forEach(item => {
    const id = get(item, 'id')
    const x = xRange.update(item)
    const y = yRange.update(item)
    const rank = ranker(item)
    const group = getGroupId(item)
    outData._insert({ id, x, y, rank, group })
  })

  return outData
}
