const { genRules } = require('./rules')

const styles = {}
const BABEL_STYLE = 'babel-style'

export default function({types: t }) {
  return {
    visitor: {
      CallExpression(path, { file, opts: { rules = [], unit = 'px' } }) {
        try {
          if (!isCreateEleCall(path.node)) return

          const names = getClassNames(path) || []
          if (names.length <= 0) return

          const filename = file.opts.filename
          const cssRules = rules.map(r => ({reg: new RegExp(r.reg), to: r.to})).concat(genRules(unit))
          const csses = genCsses(cssRules, names).concat(styles[filename] || [])

          styles[filename] = [...(new Set(csses))]

          if (tryAppendStyle(t, path, styles[filename].join(''))) styles[filename] = []
        } catch(e) {
          console.log(e)
        }
      }
    }
  };
}

const isCreateEleCall = node => {
  if (!node || !node.callee) return false

  const {object = {}, property = {}} = node.callee
  return object.name === 'React' && property.name === 'createElement'
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

const tryAppendStyle = (t, path, style) => {
  try {
    const args = path.node.arguments || []
    if (!args[1] || !args[1].properties) return
    
    const prop = args[1].properties.find(prop => prop.key.name === 'classtocss')
    if (!prop) return

    // 生成 style 标签元素
    const __html = t.ObjectProperty(t.Identifier('__html'), t.StringLiteral(style))
    const __htmlExp = t.ObjectExpression([__html])
    const dangerousProp = t.ObjectProperty(t.Identifier('dangerouslySetInnerHTML'), __htmlExp)
    const classProp = t.ObjectProperty(t.Identifier('className'), t.StringLiteral(BABEL_STYLE))
    const dangerousExp = t.ObjectExpression([dangerousProp, classProp])

    const styleNode = t.callExpression(
      t.memberExpression(t.identifier('React'), t.identifier('createElement')),
      [t.identifier('"style"'), dangerousExp]
    )
    
    path.node.arguments = args.filter(arg => !isBableStyleNode(arg))
    path.node.arguments.push(styleNode)
    return true
  } catch(e) {
    console.log(e)
  }
}

const isBableStyleNode = (node) => {
  if (node.type !== 'CallExpression') return false
  if (!isCreateEleCall(node)) return false

  const arg = node.arguments[1]
  if (!arg || !arg.properties) return false
  
  return !!arg.properties.find(prop => prop.key.name === 'className' && prop.value.value === BABEL_STYLE)
}