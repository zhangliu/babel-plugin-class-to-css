const { genValues } = require('../utils/css')

const handle = (names, path, rules, opts) => {
  if (names.length <= 0) return

  let name = names.find(n => /^bc[0-9a-fA-F]{2,8}$/.test(n))
  if (!name) return

  // 自动添加 bw1 和 bw0
  const bwReg = /^b[trbl]?w\d+$/

  let bwNames = names.filter(name => bwReg.test(name))
  if (!bwNames.length) bwNames = ['bw1']
  
  let bsName = names.find(name => /^bss$/.test(name))

  const bNames = bsName ? bwNames : bwNames.concat(['bss'])
  // 合并 class
  const key = `ctc-${bNames.join('-')}`
  names.push(key)
  const value = genValues(bNames, rules, opts).join(';')
  const csses = [`.${key}{${value}}`]

  const newNames = [...(new Set(names))].filter(name => !bwReg.test(name))

  return { names: newNames, csses }
}

module.exports = {
  handle
}