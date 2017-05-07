import Ember from 'ember';

export function truncateDecimal([value] = [], { places = 0 } = {}) {
  const capture = Math.pow(10, places)
  return Math.floor(value * capture) / capture;
}

export default Ember.Helper.helper(truncateDecimal);
