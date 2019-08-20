const { genValues } = require('../utils/css')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  const reg = /^p[trbl]?\d+$/
  const pNames = names.filter(name => reg.test(name))
  if (pNames.length <= 1) return

  // 合并 class
  const key = `ctc-${pNames.join('-')}`
  names.push(key)
  const value = genValues(pNames, rules, opts).join(';')
  const csses = [`.${key}{${value}}`]

  const newNames = [...(new Set(names))].filter(name => !reg.test(name))

  return { names: newNames, csses }
}

module.exports = {
  handle
}