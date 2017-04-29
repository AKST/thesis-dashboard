import get from 'ember-metal/get'

class Bound {
  constructor (field, description) {
    this.min = Infinity
    this.max = -Infinity
    this._field = field
    this.description = description
  }

  update (item) {
    const next = get(item, this._field)
    if (next < this.min) this.min = next
    if (next > this.max) this.max = next
    return next
  }

  get difference () {
    return this.max - this.min
  }
}


export function calculatePoints(sourceData, xConf, yConf, ranker, group) {
  const entries = [];
  const lines = {};
  const x = new Bound(xConf.source, xConf.description);
  const y = new Bound(yConf.source, yConf.description);

  function addToLine (item, source) {
    const id = group(source)
    if (! (id in lines)) {
      lines[id] = []
    }
    lines[id].push(item)
  }

  function compRank (a, b) {
    if (a.rank > b.rank) return 1
    else if (a.rank < b.rank) return 1
    else return 0
  }

  sourceData.forEach((item) => {
    const id = get(item, 'id')
    const _x = x.update(item)
    const _y = y.update(item)
    const _rank = ranker(item)
    const insert = { id, x: _x, y: _y, rank: _rank }
    addToLine(insert, item)
    entries.push(insert)
  })

  const sorted = Object.values(lines).map(it => it.sort(compRank))
  return { entries, bounds: { x, y }, lines: sorted }
}
