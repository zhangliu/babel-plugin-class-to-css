const fs = require('fs')
const { dirname, basename } = require('path')

const { genRules } = require('./rules')
const borderPlugin = require('./plugins/border')
const spanPlugin = require('./plugins/span')
const absolutePlugin = require('./plugins/absolute')

const styles = {}
let cssRules

export default function({types: t }) {
  return {
    pre(state) {
      this.cssContainer = ''
      this.csses = []

      const comments = (state.ast.comments || []).filter(c => c.type === 'CommentLine' && c.value)
      const reg = /^classtocss(=([0-9a-zA-Z_-]*))?.*$/
      const comment = comments.find(c => reg.test(c.value.trim()))
      if (!comment) return

      const container = comment.value.trim().replace(reg, '$2')
      this.cssContainer = container || basename(dirname(state.opts.filename)).toLowerCase()
    },
    visitor: {
      CallExpression(path, { file, opts: { rules = [], unit = 'px' } }) {
        if (!this.cssContainer) return
        try {
          if (!isCreateEleCall(path.node)) return

          let names = getClassNames(path) || []
          names = borderPlugin.handle(names, path)
          names = spanPlugin.handle(names, path)
          names = absolutePlugin.handle(names, path)

          cssRules = cssRules || rules.map(r => ({reg: new RegExp(r.reg), to: r.to})).concat(genRules(unit))
          const csses = genCsses(cssRules, names).concat(this.csses)
          this.csses = [...(new Set(csses))]
        } catch(e) {
          console.log(e)
        }
      }
    },

    post({ opts: { filename } }) {
      if (!this.cssContainer) return
      if (this.csses.length <= 0) return

      const index = basename(filename).indexOf('.')
      const filePath = `${dirname(filename)}/${basename(filename).substr(0, index)}.ctc.css`

      console.warn('will gen css file at: ', filePath)
      const csses = this.csses.map(c => `.${this.cssContainer} ${c}`)
      fs.writeFileSync(filePath, csses.join(''))
    }
  };
}

const isCreateEleCall = node => {
  if (!node || !node.callee) return false

  const {object = {}, property = {}} = node.callee
  return object.name === 'React' && property.name === 'createElement'
}

// const hasClasstocssProp = path => {
//   const args = path.node.arguments || []
//   if (!args[1] || !args[1].properties) return false
  
//   const prop = args[1].properties.find(prop => prop.key.name === 'classtocss')
//   return !!prop
// }

const getClassNames = (path) => {
  try {
    const arg = path.node.arguments[1]
    if (arg.type !== 'ObjectExpression') return
    if (!Array.isArray(arg.properties))  return
    const prop = arg.properties.find(prop => prop.key.name === 'className')
    if (!prop || !prop.value || !prop.value.value)  return
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

    let css = rule.func ? rule.func(name) : name.replace(rule.reg, rule.to).trim()

    // 处理 important 等特殊情况
    if (/_i(_|$)/.test(name)) css = `${css} !important`
    if (/_h(_|$)/.test(name)) name = `${name}:hover`
    if (/_f(_|$)/.test(name)) name = `${name}::before`
    if (/_a(_|$)/.test(name)) name = `${name}::after`

    result.push(`.${name}{${css}}`)
  }
  return result
}