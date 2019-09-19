const handle = (names) => {
  if (names.length <= 0) return
  if (names.includes('pf')) return

  // 判断是否有 top/right/bottom/left 和 padding 的设置
  const reg = /^[trbl]{1,1}\d+$/
  let name = names.find(n => reg.test(n))
  if (!name) return

  names.unshift('pa')

  return { names: [...(new Set(names))], csses: [] }
}

module.exports = {
  handle
}
