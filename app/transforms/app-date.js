import DS from 'ember-data';
import AppDate from 'ui/utils/app-date'

export default DS.Transform.extend({
  deserialize(serialized) {
    return AppDate.create(serialized);
  },

  serialize(deserialized) {
    return deserialized.source;
  }
});
