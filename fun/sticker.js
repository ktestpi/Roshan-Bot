const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const links = require('../containers/stickers.json')

module.exports = new Command('sticker',{
  category : 'Fun', help : 'Pegatinas de Dota 2', args : '<emoji>'},
  function(msg, args, command){
    basic.sendImageStructure(msg,args[1],links,args.until(1))
  })
