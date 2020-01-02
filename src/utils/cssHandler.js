const genCss = (ctcInfo) => {
  if (ctcInfo.type === 'common') {
    const cssValue = genCssValueFromCtcInfo(ctcInfo)

    const { name, option: { pseudo } } = ctcInfo
    const cssKey = addPseudo(name, pseudo)
    return `.${cssKey}{${cssValue}}`
  }
  if (ctcInfo.type === 'merged') {
    const { name, ctcInfos } = ctcInfo
    const cssValue = ctcInfos.map(genCssValueFromCtcInfo).join(';')
    return `.ctc_${name}{${cssValue}}`
  }
  return ''
}

const genCssValueFromCtcInfo = ctcInfo => {
  const { key, rule, option: { hasImportant } } = ctcInfo

  let cssValue = isFunc(rule.to) ? rule.to(key) : key.replace(rule.reg, rule.to)
  return addImportant(cssValue, hasImportant)
}

const addImportant = (cssValue, hasImportant) => {
  if (!hasImportant) return cssValue
  return `${cssValue.replace(';', '')} !important`
}

const addPseudo = (cssKey, pseudo) => {
  if (pseudo.hasAfter) return `${cssKey}:after`
  if (pseudo.hasBefore) return `${cssKey}:before`
  if (pseudo.hasHover) return `${cssKey}:hover`
  return cssKey
}

const isFunc = func => typeof func === 'function'

module.exports = {
  genCss
}