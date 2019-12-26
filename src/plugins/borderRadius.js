const { genValues } = require('../utils/css')
const { getMergedClassName } = require('../utils/ctcClass')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  const bReg = /^b(tl|tr|bl|br)?r\d+$/
  const bNames = names.filter(name => bReg.test(name))
  if (!bNames.length) return

  const bName = getMergedClassName(bNames)
  names.push(bName)

  const value = genValues(bNames, rules, opts).join(';')
  const csses = [`.${bName}{${value}}`]

  const newNames = [...(new Set(names))].filter(name => !bReg.test(name))

  return { names: newNames, csses }
}

module.exports = {
  handle
}