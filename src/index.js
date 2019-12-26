const fs = require('fs')
const { EOL } = require('os')
const { dirname, basename } = require('path')

const { getClassNames, setClassName } = require('./utils/className')
const { genCsses } = require('./utils/css')
const { parse } = require('./utils/ctcClass')
const { genRules } = require('./rules')
const borderWidthPlugin = require('./plugins/borderWidth')
const borderRadiusPlugin = require('./plugins/borderRadius')
const marginPlugin = require('./plugins/margin')
const paddingPlugin = require('./plugins/padding')
const spanPlugin = require('./plugins/span')
const absolutePlugin = require('./plugins/absolute')
const dotPlugin = require('./plugins/dot')

const plugins = [
  absolutePlugin,
  borderWidthPlugin,
  borderRadiusPlugin,
  spanPlugin,
  marginPlugin,
  paddingPlugin,
  dotPlugin
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
      CallExpression(path, { opts: { rules = [], units = {}, imgUrl } }) {
        if (!this.canGen) return

        const unit = getUnit(path, units)

        try {
          if (!isCreateEleCall(path.node)) return

          let names = getClassNames(path) || []
          if (names.length <= 0) return

          const innerRules = genRules(unit)
          const outerRules = rules.map(r => ({reg: new RegExp(r.reg), to: r.to}))
          const allRules = outerRules.concat(innerRules)

          if (path.node.isCtcHandle) return
          path.node.isCtcHandle = true // 设置 ctc

          // ctc class 处理
          names = parse(names)

          for(const plugin of plugins) {
            const result = plugin.handle(names, path, allRules, { imgUrl })
            if (!result) continue
            names = result.names
            this.csses = this.csses.concat(result.csses)
          }
          setClassName(path, names)

          const csses = genCsses(names, allRules, { imgUrl }).concat(this.csses)
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

const getUnit = (path, units) => {
  const defaultUnit = 'px'
  try {
    const filename = path.hub.file.opts.filename
    const keys = Object.keys(units)
    const key = keys.find(key => (new RegExp(key)).test(filename))
    if (!key) return defaultUnit
    return units[key]
  } catch(e) {
    return defaultUnit
  }
}

const isCreateEleCall = node => {
  if (!node || !node.callee) return false

  const {object = {}, property = {}} = node.callee
  return object.name === 'React' && property.name === 'createElement'
}