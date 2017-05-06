import DS from 'ember-data'

const { Model, attr } = DS

export default Model.extend({
  tags: attr('tags'),
  repr: attr('string'),
  lastModified: attr('app-date'),
});
