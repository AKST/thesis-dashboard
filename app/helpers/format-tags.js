import Ember from 'ember'

export function formatTags ([tags = []], options) {
  const { ['item-class']: itClass } = options
  const wrap = (result) => Ember.String.htmlSafe(result)

  const asElement = body => {
    const opening = itClass == null ? '<span>' : `<span class="${itClass}">`
    return `${opening}${body}</span>`
  }

  const iter = (next, acc) => {
    if (! next.length) return wrap(acc)
    const [car, ...cdr] = next
    return iter(cdr, `${acc} ${asElement(car)}`)
  };

  const [head, ...tail] = tags;
  return iter(tail, asElement(head));
}

export default Ember.Helper.helper(formatTags);
