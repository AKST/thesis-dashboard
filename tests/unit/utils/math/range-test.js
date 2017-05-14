import mathRange, { LinearRange} from 'ui/utils/math/range';
import { module, test } from 'qunit';

module('Unit | Utility | math/range');

// Replace this with your real tests.
test('it works', function(assert) {
  let result = mathRange.create('hello');
  assert.ok(result instanceof LinearRange);
});
