const handle = (names, path) => {
  if (names.length <= 0) return names
  if (path.node.arguments[0].value !== 'span') return names

  // 判断是否有 margin 和 padding 的设置
  const reg = /^[mp][trbm]{0,1}\d+$/
  let name = names.find(n => reg.test(n))
  if (!name) return names

  names.unshift('dib')

  const uniqNames = [...(new Set(names))]
  const arg = path.node.arguments[1]
  const prop = arg.properties.find(prop => prop.key.name === 'className')
  prop.value.value = uniqNames.join(' ')

  return uniqNames;
}

module.exports = {
  handle
}