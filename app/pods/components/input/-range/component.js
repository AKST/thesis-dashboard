import _uuid from 'npm:uuid'
import Ember from 'ember'

import { elementWidth, elementHeight } from 'ui/utils/dom'

const { default: uuid } = _uuid
const initCircleState = (percent, id = uuid()) =>
  Ember.Object.create({ percent, id, x: 0, ref: `#${id}` })

const Component = Ember.Component.extend({
  attributeBindings: ['_viewBox:viewBox'],
  localClassNames: ['root'],
  tagName: 'svg',

  onChange: null,
  range: null,

  _viewBox: '0 0 100 100',
  _lc: null,
  _rc: null,
  _mask: null,
  _yCenter: 0,
  _innerD: 'M0 0',
  _outerD: 'M0 0',
  _circleR: 1,
  _circleStroke: 2,
  _actualWidth: 0,
  _actualHeight: 0,

  didInsertElement (...args) {
    this._super(...args)
    const el = this.get('element')
    const maskId = uuid()
    this.set('_mask', { ref: `url(#${maskId})`, id: maskId })
    this.set('_lc', initCircleState(0))
    this.set('_rc', initCircleState(1))
    this.set('_actualHeight', elementHeight(el))
    this.set('_actualWidth', elementWidth(el))
    this.calculateDimensions()
  },

  calculateDimensions () {
    const actualWidth = this.get('_actualWidth')
    const actualHeight = this.get('_actualHeight')
    const circleR = actualHeight * (2 / 9)
    this.set('_viewBox', `0 0 ${actualWidth} ${actualHeight}`)
    this.set('_yCenter', actualHeight / 2)
    this.set('_circleR', circleR)

    for (const circleId of ['_lc', '_rc']) {
      const circle = this.get(circleId)
      const percent = circle.get('percent')
      const cRadius = this.get('circleRadiusWithStroke')
      circle.set('x', cRadius + ((actualWidth - (cRadius * 2)) * percent))
    }

    const y = actualHeight / 2

    // calc outer path
    const odx = actualWidth - (circleR * 2)
    this.set('_outerD', `M${circleR} ${y} H ${odx}`)

    this.positionInnerPath()
  },

  positionInnerPath () {
    const { min, max } = this.orderCircles()
    const y = this.get('_actualHeight') / 2
    this.set('_innerD', `M${min.get('x')} ${y} H ${max.get('x')}`)
  },

  orderCircles () {
    const l = this.get('_lc')
    const r = this.get('_rc')
    if (l.get('x') < r.get('x')) return { min: l, max: r }
    else return { min: r, max: l }
  },

  circleRadiusWithStroke: Ember.computed('_circleR', '_circleStroke', function () {
    return this.get('_circleR') + (this.get('_circleStroke') / 2)
  }),

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
      const range = this.get('range')
      this.onChange(
        range.intersectPercentage(
          min.get('percent'),
          max.get('percent')))
    }
  },

  actions: {
    mouseTargetL (event) {
      this.mouseTarget('_lc', event)
    },

    mouseTargetR (event) {
      this.mouseTarget('_rc', event)
    },
  },
});

Component.reopenClass({
  positionalParams: ['config'],
});

export default Component;
