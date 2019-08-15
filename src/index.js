const fs = require('fs')
const { EOL } = require('os')
const { dirname, basename } = require('path')

const { genRules } = require('./rules')
const borderPlugin = require('./plugins/border')
const spanPlugin = require('./plugins/span')
const absolutePlugin = require('./plugins/absolute')

let cssRules

export default function({types: t }) {
  return {
    pre(state) {
      const filename = state.opts.filename
      const index = basename(filename).indexOf('.')
      const cssFilename = `${basename(filename).substr(0, index)}.ctc.css`

      const body = state.ast.program ? state.ast.program.body || [] : []
      const cssImport = body.find(b => {
        const isTypeOk = b.type === 'ImportDeclaration'
        return isTypeOk && cssFilename === basename(b.source.value)
      })
      if (!cssImport) return

      this.canGen = true
      this.cssFilename = cssFilename
      this.csses = []
    },
    visitor: {
      CallExpression(path, { file, opts: { rules = [], unit = 'px', imgUrl } }) {
        if (!this.canGen) return
        try {
          if (!isCreateEleCall(path.node)) return

          let names = getClassNames(path) || []
          names = borderPlugin.handle(names, path)
          names = spanPlugin.handle(names, path)
          names = absolutePlugin.handle(names, path)

          cssRules = cssRules || rules.map(r => ({reg: new RegExp(r.reg), to: r.to})).concat(genRules(unit))
          const csses = genCsses(cssRules, names, { imgUrl }).concat(this.csses)
          this.csses = [...(new Set(csses))]
        } catch(e) {
          console.log(e)
        }
      }
    },

    post({ opts: { filename } }) {
      if (!this.canGen) return
      if (this.csses.length <= 0) return

      const cssFilename = `${dirname(filename)}/${this.cssFilename}`

      console.warn('will gen css file at: ', cssFilename)
      const content = `/* 自动生成文件，请不要修改 */${EOL}${this.csses.join(EOL)}`
      fs.writeFileSync(cssFilename, content)
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
    if (!prop || !prop.value || !prop.value.value)  return
    return prop.value.value.split(' ').filter(s => s.length)
  } catch (e) {
    console.log(e)
  }
}

const genCsses = (rules, names, opts) => {
  const result = []
  for (let name of names) {
    const rule = rules.find(r => r.reg.test(name))
    if (!rule) continue

    let css = rule.func ? rule.func(name, opts) : name.replace(rule.reg, rule.to).trim()

    // 处理 important 等特殊情况
    if (/_i(_|$)/.test(name)) css = `${css} !important`
    if (/_h(_|$)/.test(name)) name = `${name}:hover`
    if (/_f(_|$)/.test(name)) name = `${name}::before`
    if (/_a(_|$)/.test(name)) name = `${name}::after`

    result.push(`.${name}{${css}}`)
  }
  return result
}