const { genRules } = require('./rules')

const styles = {}

export default function({types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path, { file, opts: { styleClassName = 'babel-style', srcType = 'jsx' } }) {
        if (srcType !== 'jsx') return
        try {
          if (path.node.name.name !== 'style') return
          if (!isJSXTargetStyle(path, styleClassName)) return
          
          const filename = file.opts.filename
          addJSXDangerouslySetInnerHTML(t, path, styles[filename])
        } catch (e) {
          console.log(e)
        }
      },

      JSXAttribute(path, { file, opts: { rules = [], unit = 'px', srcType = 'jsx' } }) {
        if (srcType !== 'jsx') return
        const names = getJSXClassNames(path)
        if (!names) return
        const cssRules = rules.concat(genRules(unit))
        const csses = genCsses(cssRules, names)

        const filename = file.opts.filename
        styles[filename] = (styles[filename] || []).concat(csses)
      },

      CallExpression(path, { file, opts: { styleClassName = 'babel-style', rules = [], unit = 'px', srcType = 'jsx' } }) {
        if (srcType !== 'source') return
        try {
          const callee = path.node.callee
          const filename = file.opts.filename
          if (!callee.object) return

          const isCreateEle = callee.object.name === 'React' || callee.property.name === 'createElement'
          if (!isCreateEle) return
          if (isTargetStyle(path, styleClassName)) return addDangerouslySetInnerHTML(t, path, filename)

          const names = getClassNames(path)
          if (!names) return

          const cssRules = rules.concat(genRules(unit))
          const csses = genCsses(cssRules, names)

          styles[filename] = (styles[filename] || []).concat(csses)
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
    if (arg.type !== 'ObjectExpression') return ''
    if (!Array.isArray(arg.properties))  return ''
    const prop = arg.properties.find(prop => prop.key.name === 'className')
    if (!prop)  return ''
    return prop.value.value.split(' ').filter(s => s.length)
  } catch (e) {
    return ''
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

const isJSXTargetStyle = (path, className) => {
  try {
    const attrs = path.node.attributes
    const attr = attrs.find(attr => attr.name.name === 'className')
    if (!attr) return false
    if (attr.value.value === className) return true;
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
    
    const styleSet = [...(new Set(styles[filename]))].join('') // Set 用于去重
    styles[filename] = []

    const __html = t.ObjectProperty(t.Identifier('__html'), t.StringLiteral(styleSet))
    const value = t.ObjectExpression([__html])
    const dangerousProp = t.ObjectProperty(t.Identifier('dangerouslySetInnerHTML'), value)

    arg.properties.push(dangerousProp)
  } catch(e) {
    console.log(e)
  }
}

const addJSXDangerouslySetInnerHTML = (t, path, filename) => {
  try {
    // 先删除可能有的 dangerouslySetInnerHTML
    const node = path.node
    let attrs = node.attributes
    let dangerousAttr = attrs.find(attr => attr.name.name === 'dangerouslySetInnerHTML')
    if (dangerousAttr) attrs = node.attributes = attrs.filter(attr => attr !== dangerousAttr)
  
    // 加入新的 dangerouslySetInnerHTML
    const styleSet = [...(new Set(styles[filename]))].join('') // Set 用于去重
    styles[filename] = []

    const __html = t.ObjectProperty(t.Identifier('__html'), t.StringLiteral(styleSet))
    const value = t.JSXExpressionContainer(t.objectExpression([__html]))
    dangerousAttr = t.jSXAttribute(t.JSXIdentifier('dangerouslySetInnerHTML'), value)
    attrs.push(dangerousAttr)
  } catch (e) {
    console.log(e)
  }
}

const getJSXClassNames = path => {
  try {
    const name = path.node.name.name
    const type = path.node.value.type
    if (name === 'className' && type === 'StringLiteral') {
      return path.node.value.value.split(' ').filter(s => s.length)
    }
  } catch (e) {
    console.log(e)
  }
}

const genCsses = (rules, names) => {
  const result = []
  for (const name of names) {
    const rule = rules.find(r => r.reg.test(name))
    if (!rule) continue
    const css = name.replace(rule.reg, rule.to).trim()
    result.push(`.${name}{${css}}`) 
  }
  return result
}