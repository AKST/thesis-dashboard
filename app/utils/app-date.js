
const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/

function parseDate (dateStr) {
  const match = dateStr.match(DATE_REGEX)
  if (match == null) throw new TypeError('invalid date')

  const [, year, month, monthDay, hour, minute, second ] = match
  return { year, month, monthDay, hour, minute, second }
}


export default class AppDate {
  constructor (source, { month, monthDay, year, hour, minute, second }) {
    this._source = source
    this._monthDay = monthDay
    this._month = month
    this._year = year
    this._hour = hour
    this._minute = minute
    this._second = second
  }

  get source () {
    return this._source
  }

  static create (source) {
    const data = parseDate(source)
    return new AppDate(source, data)
  }

  toString() {
    const date = new Date(
      this._year,
      this._month,
      this._monthDay,
      this._hour,
      this._minute,
      this._second,
    );
    return date.toLocaleString();
  }
}
