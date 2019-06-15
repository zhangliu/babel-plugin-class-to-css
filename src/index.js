const { genRules } = require('./rules')

const styles = {}

export default function({types: t }) {
  return {
    visitor: {
      JSXElement(path, { file, opts: { styleClassName = 'babel-style' } }) {
        try {
          if (path.node.openingElement.name.name !== 'style') return
          if (!isTargetStyle(path, styleClassName)) return
          
          const filename = file.opts.filename
          addDangerouslySetInnerHTML(t, path, styles[filename])
        } catch (e) {
          console.log(e)
        }
      },

      JSXAttribute(path, { file, opts: { rules = [], unit = 'px' } }) {
        const names = getClassNames(path)
        if (!names) return
        const cssRules = rules.concat(genRules(unit))
        const csses = genCsses(cssRules, names)

        const filename = file.opts.filename
        styles[filename] = (styles[filename] || []).concat(csses)
      }
    }
  };
}

const isTargetStyle = (path, className) => {
  try {
    const attrs = path.node.openingElement.attributes
    const attr = attrs.find(attr => attr.name.name === 'className')
    if (!attr) return false
    if (attr.value.value === className) return true;
  } catch (e) {
    console.log(e)
    return false
  }
}

const addDangerouslySetInnerHTML = (t, path, style) => {
  try {
    // 先删除可能有的 dangerouslySetInnerHTML
    const element = path.node.openingElement
    let dangerousAttr = element.attributes.find(attr => attr.name.name === 'dangerouslySetInnerHTML')
    if (dangerousAttr) element.attributes = element.attributes.filter(attr => attr !== dangerousAttr)
  
    // 加入新的 dangerouslySetInnerHTML
    const styleSet = [...(new Set(style))].join(';') // Set 用于去重

    const _html = t.ObjectProperty(t.Identifier('_html'), t.StringLiteral(styleSet))
    const value = t.JSXExpressionContainer(t.objectExpression([_html]))
    dangerousAttr = t.jSXAttribute(t.JSXIdentifier('dangerouslySetInnerHTML'), value)
    element.attributes.push(dangerousAttr)
  } catch (e) {
    console.log(e)
  }
}

const getClassNames = path => {
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
    const css = name.replace(rule.reg, rule.to).trim().replace(';', '')
    result.push(css) 
  }
  return result
}

const unshiftToView = css => {

}