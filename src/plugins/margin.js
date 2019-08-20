const { genValues } = require('../utils/css')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  const reg = /^m[trbl]?\d+$/
  const mNames = names.filter(name => reg.test(name))
  if (mNames.length <= 1) return

  // 合并 class
  const key = `ctc-${mNames.join('-')}`
  names.push(key)
  const value = genValues(mNames, rules, opts).join(';')
  const csses = [`.${key}{${value}}`]

  const newNames = [...(new Set(names))].filter(name => !reg.test(name))

  return { names: newNames, csses }
}

module.exports = {
  handle
}