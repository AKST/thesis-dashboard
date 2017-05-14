import { groupBy } from 'ui/utils/array';
import { module, test } from 'qunit';

module('Unit | Utility | array');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = groupBy('a', [{ a: 1 }, { a: 2 }]);
  assert.equal(Object.keys(result).length, 2);
});

// Replace this with your real tests.
test('it works', function(assert) {
  let result = groupBy(it => it.a, [{ a: 1 }, { a: 2 }]);
  assert.equal(Object.keys(result).length, 2);
});
