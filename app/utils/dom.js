export function elementWidth (element) {
  const style = getComputedStyle(element, null)
  const lPadding = parseInt(style.getPropertyValue('padding-left'), 10)
  const rPadding = parseInt(style.getPropertyValue('padding-right'), 10)
  const withPadding = element.scrollWidth
  return withPadding - (lPadding + rPadding)
}

export function elementHeight (element) {
  const style = getComputedStyle(element, null)
  const tPadding = parseInt(style.getPropertyValue('padding-top'), 10)
  const bPadding = parseInt(style.getPropertyValue('padding-bottom'), 10)
  const withPadding = element.scrollHeight
  return withPadding - (tPadding + bPadding)
}
