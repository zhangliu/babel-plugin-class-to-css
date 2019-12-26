const { genValue } = require('../utils/css')
const { dotReg } = require('../utils/regs')
const { getDotClassName } = require('../utils/ctcClass')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  const reg = dotReg
  const filterNames = names.filter(name => reg.test(name))
  if (filterNames.length <= 0) return

  const csses = []
  for (const name of filterNames) {
    const key = getDotClassName(name)
    const value = genValue(name, rules, opts)
    csses.push(`.${key}{${value}}`)
    names.push(key)
  }

  const newNames = [...(new Set(names))].filter(name => !reg.test(name))
  return { names: newNames, csses }
}

module.exports = {
  handle
}