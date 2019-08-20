const handle = (names, path) => {
  if (names.length <= 0) return names

  let name = names.find(n => /^bc[0-9a-fA-F]{2,8}$/.test(n))
  if (!name) return names

  // 处理边宽
  name = names.find(n => /^b[trbl]?w\d+$/.test(n))
  if (!name) names.unshift('bw1')

  // 处理 style
  name = names.find(n => /^bss$/.test(n))
  if (!name) names.push('bss')

  const uniqNames = [...(new Set(names))]
  const arg = path.node.arguments[1]
  const prop = arg.properties.find(prop => prop.key.name === 'className')
  prop.value.value = uniqNames.join(' ')

  return uniqNames;
}

module.exports = {
  handle
}