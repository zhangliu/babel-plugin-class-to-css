const handle = (names, rules, path) => {
  if (names.length <= 0) return names;
  const bcRule = rules.find(r => r.type === 'border-color')
  const bcName = names.find(n => bcRule.reg.test(n))
  if (!bcName) return names

  // 处理边宽
  const bwRule = rules.find(r => r.type === 'border-width')
  const bwName = names.find(n => bwRule.reg.test(n))
  if (!bwName) names.unshift('bw0')

  // 处理 style
  const bsRule = rules.find(r => r.type === 'border-style')
  const bsName = names.find(n => bsRule.reg.test(n))
  if (!bsName) names.push('bss')

  const uniqNames = [...(new Set(names))]
  const arg = path.node.arguments[1]
  const prop = arg.properties.find(prop => prop.key.name === 'className')
  prop.value.value = uniqNames.join(' ')

  return uniqNames;
}

module.exports = {
  handle
}