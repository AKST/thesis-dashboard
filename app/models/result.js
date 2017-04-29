import DS from 'ember-data';

const { belongsTo, attr, Model } = DS

export default Model.extend({
  fileSize: attr('number'),
  averageTime: attr('number'),
  ghcVersion: attr('semver'),

  script: belongsTo('script'),
  package: belongsTo('package'),
});

const foldForBounds = (x, y) => (bounds, next) => {
  const { [x]: nextX, [y]: nextY } = next.getProperties(x, y)
  if (nextX < bounds.x.min) bounds.x.min = nextX
  if (nextX > bounds.x.max) bounds.x.max = nextX
  if (nextY < bounds.y.min) bounds.y.min = nextY
  if (nextY > bounds.y.max) bounds.y.max = nextY
  return bounds
}

export function getBounds(listOfResults, x = 'fileSize', y = 'averageTime') {
  return listOfResults.reduce(foldForBounds(x, y), {
    x: { min: Infinity, max: -Infinity },
    y: { min: Infinity, max: -Infinity },
  })
}
