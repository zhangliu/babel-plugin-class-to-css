const { genValues } = require('../utils/css')
const { getMergedClassName } = require('../utils/ctcClass')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  const reg = /^m[trbl]?((\d+)|(\.\d+)|(\d+\.\d+))$/
  const filterNames = names.filter(name => reg.test(name))
  if (filterNames.length <= 1) return

  // 合并 class
  const key = getMergedClassName(filterNames)

  names.push(key)
  const value = genValues(filterNames, rules, opts).join(';')
  const csses = [`.${key}{${value}}`]

  const newNames = [...(new Set(names))].filter(name => !reg.test(name))

  return { names: newNames, csses }
}

module.exports = {
  handle
}