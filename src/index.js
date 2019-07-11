const { genRules } = require('./rules')

const styles = {}

export default function({types: t }) {
  return {
    visitor: {
      CallExpression(path, { file, opts: { styleClassName = 'babel-style', rules = [], unit = 'px' } }) {
        try {
          const callee = path.node.callee
          if (!callee.object) return

          const isCreateEle = callee.object.name === 'React' || callee.property.name === 'createElement'
          if (!isCreateEle) return

          const filename = file.opts.filename
          if (isTargetStyle(path, styleClassName)) return addDangerouslySetInnerHTML(t, path, filename)

          const names = getClassNames(path) || []
          if (names.length <= 0) return

          const cssRules = rules.concat(genRules(unit))
          const csses = genCsses(cssRules, names).concat(styles[filename])

          styles[filename] = [...(new Set(csses))].join('')
        } catch(e) {
          console.log(e)
        }
      }
    }
  };
}

const getClassNames = (path) => {
  try {
    const arg = path.node.arguments[1]
    if (arg.type !== 'ObjectExpression') return
    if (!Array.isArray(arg.properties))  return
    const prop = arg.properties.find(prop => prop.key.name === 'className')
    if (!prop)  return
    return prop.value.value.split(' ').filter(s => s.length)
  } catch (e) {
    console.log(e)
  }
}

const isTargetStyle = (path, className) => {
  try {
    const args = path.node.arguments
    if (!args[0].value) return false
    if (args[0].value.toLowerCase() !== 'style') return false
    const prop = args[1].properties.find(prop => prop.key.name === 'className')
    if (!prop || !prop.value) return false

    return prop.value.value === className
  } catch (e) {
    console.log(e)
    return false
  }
}

const addDangerouslySetInnerHTML = (t, path, filename) => {
  try {
    const arg = path.node.arguments[1]
    if (arg.type !== 'ObjectExpression') return
    if (!Array.isArray(arg.properties)) return

    // 移除既有的 dangerouslySetInnerHTML 属性
    arg.properties = arg.properties.filter(prop => prop.key.name !== 'dangerouslySetInnerHTML')

    const __html = t.ObjectProperty(t.Identifier('__html'), t.StringLiteral(styles[filename]))
    const value = t.ObjectExpression([__html])
    const dangerousProp = t.ObjectProperty(t.Identifier('dangerouslySetInnerHTML'), value)

    arg.properties.push(dangerousProp)
  } catch(e) {
    console.log(e)
  }
}

const genCsses = (rules, names) => {
  const result = []
  for (let name of names) {
    const rule = rules.find(r => r.reg.test(name))
    if (!rule) continue
    let css = name.replace(rule.reg, rule.to).trim()

    // 处理 important 等特殊情况
    if (/_i(_|$)/.test(name)) css = `${css} !important`
    if (/_h(_|$)/.test(name)) name = `${name}:hover`

    result.push(`.${name}{${css}}`)
  }
  return result
}