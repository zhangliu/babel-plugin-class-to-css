const getNames = (path) => {
  try {
    const prop = getProp(path)
    if (!prop || !prop.value || !prop.value.value)  return
    return prop.value.value.split(' ').filter(s => s.length)
  } catch (e) {
    console.log(e)
  }
}

const getProp = (path, name = 'className') => {
  const arg = path.node.arguments[1]
  if (arg.type !== 'ObjectExpression') return
  if (!Array.isArray(arg.properties))  return
  
  return arg.properties.find(prop => prop.key.name === name)
}

const setClassNames = (path, names) => {
  const prop = getProp(path)
  if (!prop || !prop.value || !prop.value.value)  return

  const uniqNames = [...(new Set(names || []))]
  prop.value.value = uniqNames.join(' ')
}

module.exports = {
  getNames,
  setClassNames
}