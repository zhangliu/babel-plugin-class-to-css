module.exports = (name, opts) => {
  const url = opts.imgUrl
  if (!url) return

  const match = name.match(/^bgi-([_0-9a-zA-Z]+)(-([0-9a-zA-Z]+))?($|_.*)/)
  if (!match || !match[1]) return

  const img = match[1]
  const type = match[3] || 'png'

  return `background-image: url('${url}/${img}.${type}')`
}