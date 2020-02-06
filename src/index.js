const fs = require('fs')
const { EOL } = require('os')
const { dirname } = require('path')
const nameHandler = require('./utils/nameHandler')
const cssHandler = require('./utils/cssHandler')
const { genRules } = require('./utils/rules')
const ReactConvert = require('./convers/reactConverter')

export default function({types: t }) {
  return {
    pre(state) {
      this.convert = new ReactConvert(state);
      if (!this.convert.canConvert) return;

      this.csses = [];
    },

    visitor: {
      CallExpression(path, { opts = {} }) {
        if (!this.convert.canConvert) return;

        try {
          let names = this.convert.getNames(path.node) || [];
          if (names.length <= 0) return;
          
          if (path.node.isCtcHandle) return;
          path.node.isCtcHandle = true;

          let rules = genRules(cssHandler.UNIT_HOLDER)
          const outerRules = (opts.rules || []).map(r => ({reg: new RegExp(r.reg), to: r.to}))
          rules = outerRules.concat(rules)

          const newNames = []
          let ctcInfos = nameHandler.parse(names, rules, opts.unit || 'px')
          ctcInfos = nameHandler.merge(ctcInfos)

          for (const ctcInfo of ctcInfos) {
            newNames.push(ctcInfo.name)
            this.csses.push(cssHandler.genCss(ctcInfo))
          }

          this.convert.setClass(path.node, newNames)
        } catch(e) {
          console.log(e)
        }
      }
    },

    post({ opts: { filename } }) {
      if (!this.convert) return;
      if (!this.convert.canConvert) return;

      const cssFilename = `${dirname(filename)}/${this.convert.cssFilename}`

      console.warn('生成css文件：', cssFilename)
      this.csses = [...(new Set(this.csses))]
      const content = `/* 自动生成文件，请不要修改 */${EOL}${this.csses.join(EOL)}`
      fs.writeFileSync(cssFilename, content)
    }
  };
}