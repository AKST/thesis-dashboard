import * as semver from 'ui/utils/semver';
import { module, test } from 'qunit';

module('Unit | Utility | semver');

// Replace this with your real tests.
test('toString works', function(assert) {
  const config = { major: 7, minor: 0, patch: 4 }
  const result = semver.T.create(config);
  assert.equal(result.toString(), '7.0.4');
});
