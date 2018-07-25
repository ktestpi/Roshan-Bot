const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('cachereload',{
  category : 'Owner', help : 'Recarga la cache', args : ''},
  function(msg, args, command){
    this.cacheReload()
  })
