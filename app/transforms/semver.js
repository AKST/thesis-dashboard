import DS from 'ember-data';
import { deserialize } from 'ui/utils/semver'

export default DS.Transform.extend({
  deserialize(serialized) {
    return deserialize(serialized);
  },

  serialize(deserialized) {
    return deserialized.toString();
  }
});
