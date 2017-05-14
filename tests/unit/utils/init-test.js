import { checkKeyThenConf } from 'ui/utils/init';
import { module, test } from 'qunit';

module('Unit | Utility | init');

// Replace this with your real tests.
test('fieldKey works', function(assert) {
  let result = checkKeyThenConf({ a: 2 }, 'a');
  assert.equal(result, 2);
});

// Replace this with your real tests.
test('config works', function(assert) {
  let result = checkKeyThenConf({ config: { a: 2 } }, 'a');
  assert.equal(result, 2);
});

// Replace this with your real tests.
test('prefer fieldKey', function(assert) {
  let result = checkKeyThenConf({ config: { a: 2 }, a: 3 }, 'a');
  assert.equal(result, 3);
});
