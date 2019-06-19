const genRules = (unit = 'px') => {
  return [
    // margin
    { reg: /^m(\d+)$/, to: 'margin: $1' + unit },

    // font
    { reg: /^fs(\d+)$/, to: 'font-size: $1' + unit },

    // position
    { reg: /^pa$/, to: 'position: absolute' },
  ]
}

module.exports = {
  genRules
}