const fs = require('fs')
const parser = require('exif-parser')
const readdirp = require('readdirp')
const exec = require('child_process').exec
const moment = require('moment')

const parse = x => x.parse().tags.CreateDate

const unixDate = x => new Date(x * 1000)

const toString = x => x.toString()

const cut = x => { 
  const clean = x.split(' ').slice(1, 4)
  return `${clean[0]}-${clean[2]}`
}

const organize = x => (x.trim() !== 'Invalid Date') ? cut(x) : 'invalid-tags'

const move = (x, img) => (err, data) => { 
  const newPath = img.fullParentDir.replace(/images/, 'newImages')

  return fs.rename(img.fullPath, `${newPath}/${x}/${img.name}`)
}

const transfer = img => x => { 
  return fs.mkdir(`./newImages/${x}`, move(x, img))
}

const transform = img => (err, data) => { 
  const parsed = [parser.create(data)]
    .map(parse)
    .map(unixDate)

  //if (parsed[0].toString() !== 'Invalid Date') { 
    //const modified = moment(parsed[0]).format('YYYYMMDDhhmm')
    //exec(`touch -mt ${modified} ${img.fullPath}`)
  //}

  parsed
    .map(toString)
    .map(organize)
    .map(transfer(img))
}

const collect = (err, dir) => { 
  return dir.files.map(img => fs.readFile(`${img.fullPath}`, transform(img)))
}

readdirp({ root: './images', fileFilter: ['*.jpg', '*.jpeg']  }, collect)

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

