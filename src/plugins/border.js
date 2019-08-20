const { genValues } = require('../utils/css')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  let name = names.find(n => /^bc[0-9a-fA-F]{2,8}$/.test(n))
  if (!name) return

  // 自动添加 bw1 和 bw0
  const bwReg = /^b[trbl]?w\d+$/
  name = names.find(name => bwReg.test(name))
  if (!name) names.unshift('bw1')

  const bwNames = names.filter(name => bwReg.test(name))
  if (bwNames.length <= 1) return

  // 合并 class
  const key = `ctc-${bwNames.join('-')}`
  names.push(key)
  const value = genValues(bwNames, rules, opts).join(';')
  const csses = [`.${key}{${value}}`]

  const newNames = [...(new Set(names))].filter(name => !bwReg.test(name))

  return { names: newNames, csses }
}

module.exports = {
  handle
}