require('babel-register')

const glob = require('glob')
const path = require('path')

const all = {}

glob.sync('../sketches/*').forEach(function (file) {
  const name = path.parse(file).name
  all[name] = {
    Module: require(path.resolve(file)),
    config: require(path.resolve(file + '/config.js'))
  }
})

module.exports = all
