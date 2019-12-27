const {dotReg} = require('./regs')

const DOT = 'dot'

const getMergedClassName = names => {
  const result = []
  for (const name of names) {
    if (dotReg.test(name)) {
      result.push(name.replace('.', DOT))
      continue
    }
    result.push(name)
  }

  return `ctc-${result.join('-')}`
}

const getDotClassName = name => `ctc-${name.replace('.', DOT)}`
const getPercentClassName = name => `ctc-${name.replace('%', 'percent')}`

const parse = (names) => {
  const ctcReg = /^ctc-(.*)$/
  const ctcNames = names.filter(name => ctcReg.test(name))
  let result = names.filter(name => !ctcReg.test(name))

  for (const ctcName of ctcNames) {
    const tmpNames = ctcName.replace(ctcReg, '$1')
      .replace(/dot/g, '.').split('-') // TODO 这块-和负数符号冲突，需要改掉！
    result = result.concat(tmpNames)
  }
  return [...(new Set(result))]
}

module.exports = {
  getMergedClassName,
  getDotClassName,
  getPercentClassName,
  parse
}