const { genRules } = require('./rules')

const styles = {}

export default function({types: t }) {
  return {
    visitor: {
      CallExpression(path, { file, opts: { rules = [], unit = 'px' } }) {
        try {
          const callee = path.node.callee
          if (!callee.object) return

          const isCreateEle = callee.object.name === 'React' || callee.property.name === 'createElement'
          if (!isCreateEle) return

          const names = getClassNames(path) || []
          if (names.length <= 0) return

          const filename = file.opts.filename
          const cssRules = rules.concat(genRules(unit))
          const csses = genCsses(cssRules, names).concat(styles[filename])

          styles[filename] = [...(new Set(csses))].join('')

          tryAppendStyle(t, path, filename)
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

const tryAppendStyle = (t, path, filename) => {
  try {
    const args = path.node.arguments || []
    if (!args[1] || !args[1].properties) return
    
    const prop = args[1].properties.find(prop => prop.key.name === 'classToCss')
    if (!prop) return

    // 生成 style 标签元素
    const __html = t.ObjectProperty(t.Identifier('__html'), t.StringLiteral(styles[filename]))
    const __htmlExp = t.ObjectExpression([__html])
    const dangerousProp = t.ObjectProperty(t.Identifier('dangerouslySetInnerHTML'), __htmlExp)
    const dangerousExp = t.ObjectExpression([dangerousProp])

    const styleNode = t.callExpression(
      t.memberExpression(t.identifier('React'), t.identifier('createElement')),
      [t.identifier('"style"'), dangerousExp]
    )

    args.push(styleNode)
  } catch(e) {
    console.log(e)
  }
}