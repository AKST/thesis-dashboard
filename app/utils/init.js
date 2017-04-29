import get from 'ember-metal/get'

export function checkKeyThenConf (self, fieldKey, otherwise=null) {
  const { [fieldKey]: field, config } = self.getProperties('config', fieldKey)
  if (field != null) return field;

  const conField = config ? get(config, fieldKey) : null
  if (conField != null) return conField

  return otherwise
}
