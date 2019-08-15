module.exports = (name, opts) => {
  const url = opts.imgUrl
  if (!url) return

  const match = name.match(/^bgi([0-9a-zA-Z]+)-([0-9a-zA-Z]+)($|_.*)/)
  if (!match) return
  if (!match[1] || !match[2]) return

  return `background-image: url('${url}/${match[1]}.${match[2]}')`
}