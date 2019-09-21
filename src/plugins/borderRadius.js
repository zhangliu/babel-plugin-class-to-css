const { genValues } = require('../utils/css')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  const brReg = /^b(tl|tr|bl|br)?r\d+$/

  let brNames = names.filter(name => brReg.test(name))
  if (brNames.length <= 0) return
  
  // 合并 class
  const key = `ctc-${brNames.join('-')}`
  names.push(key)
  const value = genValues(brNames, rules, opts).join(';')
  const csses = [`.${key}{${value}}`]

  const newNames = [...(new Set(names))].filter(name => !brReg.test(name))

  return { names: newNames, csses }
}

module.exports = {
  handle
}