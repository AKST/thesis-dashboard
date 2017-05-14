import get from 'ember-metal/get'

export function checkKeyThenConf (self, fieldKey, otherwise=null) {
  const field = get(self, fieldKey)
  if (field != null) return field;

  const config = get(self, 'config')
  const conField = config ? get(config, fieldKey) : null
  if (conField != null) return conField

  return otherwise
}
