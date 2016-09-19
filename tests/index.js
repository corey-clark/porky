const utils = require('../index.js')
const expect = require('chai').expect
const parser = require('exif-parser')
const fs = require('fs')
const validator = require('validator')

const cut = utils.cut
const parse = utils.parse
const toString = utils.toString
const unixDate = utils.unixDate
const collect = utils.collect

var globalData

beforeEach(done => { 
    fs.readFile('./tests/images/zero.jpg', (err, data) => { 
      if (err) done(err)

      else
        globalData = data
        done()
    })
})

describe('cut', () => { 
  var timestamp

  beforeEach(() => { 
    timestamp = [parser.create(globalData)] 
      .map(parse)
      .map(unixDate)
      .map(toString)
      .map(cut)
  })

  it ('should return a string', () => { 
    expect(timestamp[0]).to.be.a('string')
  })

  it ('should return a valid date', () => { 
    expect(validator.isDate(timestamp[0])).to.be.equal(true)
  })
})

describe('parse', () => { 
  it ('should return a unix timestamp', () => { 
    const timestamp = parse(parser.create(globalData))
    expect(timestamp).to.be.a('number')
  })

  it ('should return undefined if no timestamp exists', done => { 
    fs.readFile('./tests/invalid-tags/one.jpg', (err, data) => { 
      if (err) done(err)

      else
        const date = [parser.create(data)].map(parse)
        expect(date[0]).to.equal(undefined)
        done()
    })
  })
})

describe('toString', () => { 
  it ('should return a string', () => { 
    const num = 18 
    expect(toString(num)).to.be.a('string')
  })
})

describe('unixDate', () => { 
  var invalidData

  beforeEach(done => { 
    fs.readFile('./tests/invalid-tags/one.jpg', (err, data) => { 
      if (err) done(err)

      else
        invalidData = data
        done()
    })
  
  })

  it ('should convert unix timestamp to valid date', () => { 
    const timestamp = [parser.create(globalData)]
      .map(parse)
      .map(unixDate)
      .map(toString)

    expect(validator.isDate(timestamp[0])).to.equal(true)
  })

  it ('should return a string if it receives an invalid date', () => { 
    const timestamp = [parser.create(invalidData)]
      .map(parse)
      .map(unixDate)
      .map(toString)

    expect(timestamp[0]).to.equal('Invalid Date')
  })
})
