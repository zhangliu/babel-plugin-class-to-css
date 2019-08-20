const genCsses = (names, rules, opts) => {
  const result = []
  for (let name of names) {
    const key = genKey(name)
    const value = genValue(name, rules, opts)
    if (!value) continue

    result.push(`.${key}{${value}}`)
  }
  return result
}

const genKey = (name) => {
  let result = name

  if (/_h(_|$)/.test(name)) result = `${name}:hover`
  if (/_f(_|$)/.test(name)) result = `${name}::before`
  if (/_a(_|$)/.test(name)) result = `${name}::after`

  return result
}

const genValue = (name, rules, opts) => {
  const rule = rules.find(r => r.reg.test(name))
  if (!rule) return

  let value = rule.func ? rule.func(name, opts) : name.replace(rule.reg, rule.to).trim()

  // 处理 important 等特殊情况
  if (/_i(_|$)/.test(name)) value = `${value} !important`
  return value
}

const genValues = (names, rules, opts) => {
  const result = []
  for (const name of names) {
    const value = genValue(name, rules, opts)
    if (!value) continue
    result.push(value)
  }
  return result
}

module.exports = {
  genCsses,
  genKey,
  genValue,
  genValues
}