const fs = require('fs')
const { EOL } = require('os')
const { dirname, basename } = require('path')
const nameHandler = require('./utils/nameHandler')
const cssHandler = require('./utils/cssHandler')
const { genRules } = require('./utils/rules')

const { getNames, setClassName } = require('./utils/className')

export default function({types: t }) {
  return {
    pre(state) {
      const filename = state.opts.filename
      const index = basename(filename).indexOf('.')
      const cssFilename = `${basename(filename).substr(0, index)}.ctc.css`

      // 判断有没有导入 ctc.css 文件
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
      CallExpression(path, { opts = {} }) {
        if (!this.canGen) return

        try {
          if (!isCreateEleCall(path.node)) return

          let names = getNames(path) || []
          if (names.length <= 0) return
          
          if (path.node.isCtcHandle) return
          path.node.isCtcHandle = true // 设置 ctc

          const rules = genRules(opts.unit) // TODO 需要联合外面的 rules
          const newNames = []
          let ctcInfos = nameHandler.parse(names, rules)
          ctcInfos = nameHandler.merge(ctcInfos)

          for (const ctcInfo of ctcInfos) {
            newNames.push(ctcInfo.name)
            this.csses.push(cssHandler.genCss(ctcInfo))
          }

          setClassName(path, newNames)
        } catch(e) {
          console.log(e)
        }
      }
    },

    post({ opts: { filename } }) {
      if (!this.canGen) return

      const cssFilename = `${dirname(filename)}/${this.cssFilename}`

      console.warn('生成css文件：', cssFilename)
      this.csses = [...(new Set(this.csses))]
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