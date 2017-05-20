import Component from 'ember-component'
import EmObject from 'ember-object'
import run, { later } from 'ember-runloop'
import computed, { observes } from 'ember-computed-decorators'

import uuid from 'npm:uuid'

import styles from './styles'
import { checkKeyThenConf } from 'ui/utils/init'
import { elementWidth, elementHeight } from 'ui/utils/dom'

const initCircleState = (percent, id) =>
  EmObject.create({ percent, id, x: 0, ref: `#${id}` })

export default Component.extend({
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

  _resize_callback: null,

  // life time hooks

  didInsertElement (...args) {
    this._super(...args)

    /**
     * No need to tear these events down as they'll be gone after
     * the component is unmounted from the page.
     */
    for (const el of this.element.getElementsByClassName(styles.circle)) {
      const id = el.dataset.circle === 'a' ? '_a' : '_b'
      el.addEventListener('mousedown', event => this.mouseTarget(id, event))
    }

    later(() => this.calculateDimensions(), 0)

    const callback = () => run(() => this.calculateDimensions());
    this.set('_resize_callback', callback);
    window.addEventListener('resize', callback);
  },

  willDestoryElement (...args) {
    this._super(...args);
    window.removeEventListener('resize', this.get('_resize_callback'));
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

  @computed('_circleR', '_circleStroke')
  circleRadiusWithStroke (_circleR, _circleStroke) {
    return _circleR + (_circleStroke / 2)
  },

  // events

  @observes('config')
  handleConfigUpdate () {
    this.calculateDimensions()
  },

  mouseTarget (circleId, originalEvent) {
    const handler = this.redrawSlider(circleId, originalEvent)

    const finish = function () {
      window.removeEventListener('mousemove', handler)
      window.removeEventListener('mouseup', finish)
      window.removeEventListener('mouseleave', finish)
    }

    window.addEventListener('mousemove', handler)
    window.addEventListener('mouseup', finish)
    window.addEventListener('mouseleave', finish)
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
}).reopenClass({
  positionalParams: ['config'],
})

