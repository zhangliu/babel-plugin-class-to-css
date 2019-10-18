const fs = require('fs')
const { EOL } = require('os')
const { dirname, basename } = require('path')

const { getClassNames, setClassName } = require('./utils/className')
const { genCsses } = require('./utils/css')
const { genRules } = require('./rules')
const borderPlugin = require('./plugins/border')
const borderRadiusPlugin = require('./plugins/borderRadius')
const marginPlugin = require('./plugins/margin')
const paddingPlugin = require('./plugins/padding')
const spanPlugin = require('./plugins/span')
const absolutePlugin = require('./plugins/absolute')

let cssRules
const ctcReg = /^ctc-(.*)$/
const plugins = [
  absolutePlugin,
  borderPlugin,
  borderRadiusPlugin,
  spanPlugin,
  marginPlugin,
  paddingPlugin
]

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
      CallExpression(path, { opts: { rules = [], unit = 'px', imgUrl } }) {
        if (!this.canGen) return
        try {
          if (!isCreateEleCall(path.node)) return

          let names = getClassNames(path) || []
          if (names.length <= 0) return

          cssRules = cssRules || rules.map(r => ({reg: new RegExp(r.reg), to: r.to})).concat(genRules(unit))

          if (path.node.isCtcHandle) return
          path.node.isCtcHandle = true // 设置 ctc

          // 插件处理, ctc- 是插件处理后的结果，有的话表示处理过了
          // if (names.find(name => /^ctc-.*$/.test(name))) return
          const ctcNames = names.filter(name => ctcReg.test(name))
          for (const ctcName of ctcNames) {
            const tmpNames = ctcName.replace(ctcReg, '$1').split('-')
            names = names.concat(tmpNames)
          }
          names = [...(new Set(names))].filter(name => !ctcReg.test(name))

          for(const plugin of plugins) {
            const result = plugin.handle(names, path, cssRules, { imgUrl })
            if (!result) continue
            names = result.names
            this.csses = this.csses.concat(result.csses)
          }
          setClassName(path, names)

          const csses = genCsses(names, cssRules, { imgUrl }).concat(this.csses)
          this.csses = [...(new Set(csses))]
        } catch(e) {
          console.log(e)
        }
      }
    },

    post({ opts: { filename } }) {
      if (!this.canGen) return

      const cssFilename = `${dirname(filename)}/${this.cssFilename}`

      console.warn('生成css文件：', cssFilename)
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