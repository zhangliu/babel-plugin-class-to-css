const MERGE_REGS = {
  brReg: /^b(tl|tr|bl|br)?r((\d+)|(\.\d+)|(\d+\.\d+))$/, // border-radius
  bwReg: /^b[trbl]?w((\d+)|(\.\d+)|(\d+\.\d+))$/, // border-width
  mReg: /^m[trbl]?((\d+)|(\.\d+)|(\d+\.\d+))$/, // margin
  pReg: /^p[trbl]?((\d+)|(\.\d+)|(\d+\.\d+))$/, // padding
}

const parse = (names, rules) => {
  const ctcInfos = []
  for (const name of names) {
    ctcInfos.push(getCtcInfo(name, rules))
  }
  return ctcInfos
}

const getCtcInfo = (name, rules) => {
  const key = rmSuffix(name)
  const rule = rules.find(rule => rule.reg.test(key))
  if (!rule) return { name }

  return {
    type: 'common',
    key,
    name: replaceSpecSymbol(name),
    rule,
    option: {
      hasImportant: hasImportant(name),
      pseudo: {
        hasAfter: hasAfter(name),
        hasBefore: hasBefore(name),
        hasHover: hasHover(name)
      }
    }
  }
}

const rmSuffix = name => {
  let result = rmImportant(name)
  result = rmAfter(result)
  result = rmBefore(result)
  return rmHover(result)
}

const hasImportant = name => /_i($|_)/.test(name)
const rmImportant = name => name.replace(/_i$/, '').replace(/_i_/g, '_')

const hasAfter = name => /_a($|_)/.test(name)
const rmAfter = name => name.replace(/_a$/, '').replace(/_a_/g, '_')

const hasBefore = name => /_b($|_)/.test(name)
const rmBefore = name => name.replace(/_b$/, '').replace(/_b_/g, '_')

const hasHover = name => /_h($|_)/.test(name)
const rmHover = name => name.replace(/_h$/, '').replace(/_h_/g, '_')

const replaceSpecSymbol = (name) => {
  return name.replace(/\./g, '_dot_').replace(/%/g, '_percent_')
}

const merge = (ctcInfos) => {
  let result = ctcInfos
  const regs = Object.values(MERGE_REGS)
  for (const reg of regs) {
    const tmpInfos = ctcInfos.filter(ctcInfo => canMerged(ctcInfo, reg))
    if (tmpInfos.length <= 1) continue

    const mergedCtcInfo = mergeToOne(tmpInfos)
    
    // 剔除掉已合并的，添加上合并后的
    result = result.filter(info => !tmpInfos.includes(info))
    result.push(mergedCtcInfo)
  }
  return result
}

const mergeToOne = ctcInfos => {
  return {
    type: 'merged',
    name: ctcInfos.map(ctcInfo => ctcInfo.name).join('_'),
    ctcInfos
  }
}

const canMerged = (ctcInfo, reg) => {
  if (!reg.test(ctcInfo.key)) return false
  const hasPseudo = Object.values(ctcInfo.option.pseudo).find(value => !!value)
  return !hasPseudo
}

module.exports = {
  parse,
  merge
}