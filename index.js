const fs = require('fs')
const parser = require('exif-parser')

const parse = x => x.parse().tags.CreateDate

const unixDate = x => new Date(x * 1000)

const toString = x => x.toString()

const cut = x => x.split(' ').slice(1, 4).join('-')

const organize = x => (x.trim() !== 'Invalid Date') ? cut(x) : 'invalid-tags'

const move = (x, y) => (err, data) =>
  fs.rename(`./images/${y}`, `./newImages/${x}/${y}`)

const transfer = img => x => 
  fs.mkdir(`./newImages/${x}`, move(x, img))

const transform = x => (err, data) => (
  [parser.create(data)]
    .map(parse)
    .map(unixDate)
    .map(toString)
    .map(organize)
    .map(transfer(x))
)

const collect = (err, dir) => dir
    .filter(x => x !== '.DS_Store')
    .map(x => fs.readFile(`./images/${x}`, transform(x)))

fs.readdir('./images', collect)

module.exports = { 
  collect,
  cut,
  move,
  organize,
  toString,
  transfer,
  transform,
  parse,
  unixDate
}

