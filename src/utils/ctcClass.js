const getClassName = names => `ctc-${names.join('-')}`

const parse = (names) => {
  const ctcReg = /^ctc-(.*)$/
  const ctcNames = names.filter(name => ctcReg.test(name))
  let result = names.filter(name => !ctcReg.test(name))

  for (const ctcName of ctcNames) {
    const tmpNames = ctcName.replace(ctcReg, '$1').split('-')
    result = result.concat(tmpNames)
  }
  return [...(new Set(result))]
}

module.exports = {
  getClassName,
  parse
}