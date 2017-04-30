import uuid from 'npm:uuid'
import Ember from 'ember'
import styles from './styles'
import computed, { observes } from 'ember-computed-decorators'

import { checkKeyThenConf } from 'ui/utils/init'
import { elementWidth, elementHeight } from 'ui/utils/dom'

const initCircleState = (percent, id) =>
  Ember.Object.create({ percent, id, x: 0, ref: `#${id}` })

const Component = Ember.Component.extend({
  localClassNames: ['root'],

  onChange: null,
  config: null,
  range: null,

  @computed('range', 'config')
  _range () {
    return checkKeyThenConf(this, 'range', null)
  },

  @computed('onChange', 'config')
  _onChange () {
    return checkKeyThenConf(this, 'onChange', null)
  },

  _viewBox: '0 0 100 100',
  _a: null,
  _b: null,
  _mask: null,
  _yCenter: 0,
  _innerD: 'M0 0',
  _outerD: 'M0 0',
  _circleR: 1,
  _circleStroke: 2,
  _actualWidth: 0,
  _actualHeight: 0,

  // life time hooks

  didInsertElement (...args) {
    this._super(...args)
    const el = this.get('element')

    for (const el of this.element.getElementsByClassName(styles.circle)) {
      const id = el.dataset.circle === 'a' ? '_a' : '_b'
      el.addEventListener('mousedown', event => this.mouseTarget(id, event))
    }

    this.calculateDimensions()
  },

  // calculations

  calculateDimensions () {
    const el = this.get('element')
    const aId = uuid()
    const bId = uuid()
    const maskId = uuid()
    this.set('_mask', { ref: `url(#${maskId})`, id: maskId })
    this.set('_a', initCircleState(0, aId))
    this.set('_b', initCircleState(1, bId))
    this.set('_actualHeight', elementHeight(el))
    this.set('_actualWidth', elementWidth(el))

    const actualWidth = this.get('_actualWidth')
    const actualHeight = this.get('_actualHeight')
    const y = actualHeight / 2
    const circleR = actualHeight * (2 / 9)

    this.set('_viewBox', `0 0 ${actualWidth} ${actualHeight}`)
    this.set('_yCenter', y)
    this.set('_circleR', circleR)

    for (const circleId of ['_a', '_b']) {
      this.resetCircleLocation(circleId)
    }

    // calc outer path
    const odx = actualWidth - (circleR * 2)
    this.set('_outerD', `M${circleR} ${y} H ${odx}`)
    this.positionInnerPath()
  },

  resetCircleLocation (circleId) {
    const actualWidth = this.get('_actualWidth')
    const circle = this.get(circleId)
    const percent = circle.get('percent')
    const cRadius = this.get('circleRadiusWithStroke')
    const x = cRadius + ((actualWidth - (cRadius * 2)) * percent)
    circle.set('x', x)
  },

  positionInnerPath () {
    const { min, max } = this.orderCircles()
    const y = this.get('_actualHeight') / 2
    this.set('_innerD', `M${min.get('x')} ${y} H ${max.get('x')}`)
  },

  orderCircles () {
    const a = this.get('_a')
    const b = this.get('_b')
    if (a.get('x') < b.get('x')) return { min: a, max: b }
    else return { min: b, max: a }
  },

  circleRadiusWithStroke: Ember.computed('_circleR', '_circleStroke', function () {
    return this.get('_circleR') + (this.get('_circleStroke') / 2)
  }),

  // events

  @observes('config')
  handleConfigUpdate () {
    this.calculateDimensions()
  },

  mouseTarget (circleId, originalEvent) {
    const element = this.get('element')
    const handler = this.redrawSlider(circleId, originalEvent)
    const finish = () => {
      element.removeEventListener('mousemove', handler)
      element.removeEventListener('mouseleave', finish)
      element.removeEventListener('mouseup', finish)
    }

    element.addEventListener('mousemove', handler)
    element.addEventListener('mouseleave', finish)
    element.addEventListener('mouseup', finish)
  },

  redrawSlider (circleId, { screenX: originalScreenX }) {
    const originalX = this.get(`${circleId}.x`)
    return ({ screenX: newScreenX }) => {
      const diff = originalScreenX - newScreenX
      const width = this.get('_actualWidth')
      const radius = this.get('circleRadiusWithStroke')
      const minBound = radius
      const maxBound = width - radius
      const possibleX = originalX - diff
      const actualX = Math.max(minBound, Math.min(maxBound, possibleX))
      const percent = (actualX - minBound) / (width - (radius * 2))

      const circle = this.get(circleId)
      circle.set('x', actualX)
      circle.set('percent', percent)
      this.positionInnerPath()

      const { min, max } = this.orderCircles()
      const range = this.get('_range')
      this.get('_onChange')(
        range.intersectPercentage(
          min.get('percent'),
          max.get('percent')))
    }
  },
});

Component.reopenClass({
  positionalParams: ['config'],
});

export default Component;
