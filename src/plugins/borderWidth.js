const { genValues } = require('../utils/css')
const { getClassName } = require('../utils/ctcClass')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  // 处理border-width
  const bReg = /^b[trbl]?w\d+$/
  const bNames = names.filter(name => bReg.test(name))
  if (!bNames.length) return

  const bName = getClassName(bNames)
  console.log()
  names.push(bName)

  const value = genValues(bNames, rules, opts).join(';')
  const csses = [`.${bName}{${value}}`]

  const newNames = [...(new Set(names))].filter(name => !bReg.test(name))

  return { names: newNames, csses }
}

module.exports = {
  handle
}