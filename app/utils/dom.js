function width(element) {
  if (element.scrollWidth) return element.scrollWidth
  const style = getComputedStyle(element, null)
  return parseInt(style.getPropertyValue('width'), 10)
}

function height(element) {
  if (element.scrollHeight) return element.scrollHeight
  const style = getComputedStyle(element, null)
  return parseInt(style.getPropertyValue('height'), 10)
}

export function elementWidth (element) {
  const style = getComputedStyle(element, null)
  const lPadding = parseInt(style.getPropertyValue('padding-left'), 10)
  const rPadding = parseInt(style.getPropertyValue('padding-right'), 10)
  const withPadding = width(element)
  return withPadding - (lPadding + rPadding)
}

export function elementHeight (element) {
  const style = getComputedStyle(element, null)
  const tPadding = parseInt(style.getPropertyValue('padding-top'), 10)
  const bPadding = parseInt(style.getPropertyValue('padding-bottom'), 10)
  const withPadding = height(element)
  return withPadding - (tPadding + bPadding)
}
