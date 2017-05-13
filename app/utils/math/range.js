export class Range {
  constructor (description) {
    this.description = description;
  }

  static create (description, ordinal=null) {
    if (ordinal != null) return new OrdinalRange(description, ordinal);
    return new LinearRange(description);
  }
}

export class OrdinalRange extends Range {
  constructor (description, domain) {
    super(description);
    this.domain = domain;
  }

  acknowledge (value) {

  }

  refine () {
    return this
  }

  containsValue (value) {
    return this.domain.includes(value);
  }
}

export class LinearRange extends Range {
  constructor (description) {
    super(description);
    this.min = Infinity
    this.max = -Infinity
  }

  containsValue (value) {
    if (value > this.max) return false
    if (value < this.min) return false
    return true
  }

  acknowledge (value) {
    if (value < this.min) this.min = value
    if (value > this.max) this.max = value
  }

  refine (other) {
    if (other == null) return this
    const copy = new LinearRange(this.description)
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
    return new LinearRange(this.description)
  }
}

export default Range
