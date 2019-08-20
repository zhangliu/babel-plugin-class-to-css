const handle = (names, path) => {
  if (names.length <= 0) return
  if (path.node.arguments[0].value !== 'span') return

  // 判断是否有 margin 和 padding 的设置
  const reg = /^[mp][trbl]{0,1}\d+$/
  let name = names.find(n => reg.test(n))
  if (!name) return

  names.unshift('dib')

  return { names: [...(new Set(names))], csses: [] }
}

module.exports = {
  handle
}