const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const links = require('../containers/charms.json')

module.exports = new Command('anicharm',{
  category : 'Fun', help : 'Emojis animados brillantes de Dota 2', args : '<emoji>'},
  function(msg, args, command){
    basic.sendImageStructure(msg,args[1],links,args.until(1))
  })
