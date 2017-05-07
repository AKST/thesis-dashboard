import Model from 'ember-data/model'
import attr from 'ember-data/attr'


export default Model.extend({
  tags: attr('tags'),
  repr: attr('string'),
  lastModified: attr('app-date'),
});
