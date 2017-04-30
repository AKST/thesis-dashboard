import Ember from 'ember'
import styles from './styles'

import { select } from 'd3-selection'
import { scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { line } from 'd3-shape'

import { elementWidth, elementHeight } from 'ui/utils/dom'

function nanFallback (number, fallback) {
  return Number.isNaN(number) ? fallback : number
}

function circleRadius (item) {
  return item.rank * 8
}

export default Ember.Component.extend({
  localClassNames: ['root'],

  lines: null,
  bounds: null,
  entries: null,
  selectNode: null,

  _chartElement: null,

  _lines: Ember.computed('lines', function () {
    const lines = this.get('lines')
    const _default = []
    return lines != null ? lines : _default
  }),

  _entries: Ember.computed('entries', function () {
    const entries = this.get('entries')
    const _default = []
    return entries != null ? entries : _default
  }),

  _selectNode: Ember.computed('selectNode', function () {
    const fn = this.get('selectNode')
    const _default = function () {}
    return fn != null ? fn : _default
  }),

  didInsertElement (...args) {
    this._super(...args)
    this.renderGraph()
  },

  didUpdateAttrs (...args) {
    this._super(...args)
    this.renderGraph()
  },

  clean () {
    const oldChart = this.get('_chartElement')
    if (oldChart != null) {
      oldChart.remove();
      this.set('_chartElement', null)
    }
  },

  renderGraph() {
    // remove the older chart
    this.clean();

    // calculate some key dimensions
    const element = this.get('element')
    const margin = parseInt(styles.margin, 10)
    const width = elementWidth(element) - (margin * 3.5)
    const height = elementHeight(element) - (margin * 2)
    const items = this.get('_entries')
    const mainX = margin * 1.8
    const mainY = margin * 0.75

    // initialise chart and

    const chart = select(element).append('svg:svg')
      .attr('width', width + (margin * 3))
      .attr('height', height + (margin * 2))
      .attr('class', styles.svg_root)
    this.set('_chartElement', chart);

    const main = chart.append('g')
      .attr('transform', `translate(${mainX},${mainY})`)
      .attr('width', width)
      .attr('height', height)
      .attr('class', styles.main)

    const bounds = this.get('bounds')
    const xScale = scaleLinear()
      .domain([bounds.x.min, bounds.x.max])
      .range([0, width + (margin / 2)])

    const yScale = scaleLinear()
     .domain([bounds.y.min, bounds.y.max])
     .range([height, 0 - (bounds.y.difference / 10)])

    main.append('g')
      .attr('transform', `translate(0,${height})`)
      .attr('class', styles.x_axis)
      .call(axisBottom(xScale))

    main.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', styles.y_axis)
      .call(axisLeft(yScale))

    main.append('svg:g').selectAll(styles.data_point)
      .data(items).enter().append('svg:circle')
        .attr('cx', item => nanFallback(xScale(item.x), 0))
        .attr('cy', item => yScale(item.y))
        .attr('class', styles.data_point)
        .attr('r', circleRadius)
        .on('mouseover', d => this.get('_selectNode')(d.id))

    const xTitleX = (width / 2) + (margin * 1.5)
    const xTitleY = height + (margin * 1.75)
    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${xTitleX}, ${xTitleY})`)
      .attr('class', styles.axis_label)
      .text(bounds.x.description)

    const yTitleX = margin * 0.75
    const yTitleY = (height / 2) + margin
    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${yTitleX}, ${yTitleY}) rotate(-90)`)
      .attr('class', styles.axis_label)
      .text(bounds.y.description)


    const lineFunction = line()
      .x(it => nanFallback(xScale(it.x), 0))
      .y(it => yScale(it.y))

    for (const l of this.get('_lines')) {
      main.append('path')
        .attr('d', lineFunction(l))
        .attr('class', styles.line)
        .attr('fill', 'transparent')
        .attr('stroke-width', 2)
    }
  },
});