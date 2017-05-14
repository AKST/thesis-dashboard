import Component from 'ember-component'
import computed from 'ember-computed-decorators'
import styles from './styles'

import { select } from 'd3-selection'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { line } from 'd3-shape'

import { elementWidth, elementHeight } from 'ui/utils/dom'

function nanFallback (number, fallback) {
  return Number.isNaN(number) ? fallback : number
}

export default Component.extend({
  localClassNames: ['root'],

  selectNode: null,
  entries: null,
  bounds: null,

  _chartElement: null,

  @computed('entries')
  _entries (lines) {
    return lines != null ? lines : []
  },

  @computed('lines')
  _lines (lines) {
    return lines != null ? lines : []
  },

  @computed('selectNode')
  _selectNode (fn) {
    const _default = function () {}
    return fn != null ? fn : _default
  },

  callback: null,

  didInsertElement (...args) {
    this._super(...args)
    this.renderGraph()

    const callback = () => Ember.run(() => this.renderGraph());
    this.set('callback', callback)
    window.addEventListener('resize', callback)
  },

  willDestoryElement (...args) {
    this._super(...args)
    window.removeElementListener('resize', this.get('callback'));
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

    const element = this.get('element')
    const margin = parseInt(styles.margin, 10)
    const width = elementWidth(element) - (margin * 3.5)
    const height = elementHeight(element) - (margin * 2)
    const items = this.get('_entries')

    const mainX = margin * 1.8
    const mainY = margin * 0.75

    const chart = select(element).append('svg:svg')
      .attr('width', width + (margin * 3))
      .attr('height', height + (margin * 2))
      .attr('class', styles.svg_root)
    this.set('_chartElement', chart)

    const main = chart.append('g')
      .attr('transform', `translate(${mainX},${mainY})`)
      .attr('width', width)
      .attr('height', height)
      .attr('class', styles.main)

    const bounds = this.get('bounds')

    const xScale = scaleOrdinal()
      .domain(bounds.x.domain)
      .range(bounds.x.domain
        .map((_, it) => width * (it / (bounds.x.domain.length - 1))))

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
        .attr('style', item => `fill: ${this.colorPicker(item.group)}`)
        .attr('r', item => parseInt(styles.pointSize, 10))
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
      if (l.length < 1) continue;
      const color = this.colorPicker(l[0].group)
      main.append('path')
        .attr('d', lineFunction(l))
        .attr('class', styles.line)
        .attr('style', `stroke: ${color}`)
        .attr('fill', 'transparent')
        .attr('stroke-width', 2)
    }
  },
})
