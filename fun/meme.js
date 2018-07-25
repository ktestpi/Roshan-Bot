const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const links = require('../containers/memes.json')

module.exports = new Command('meme',{
  category : 'Fun', help : 'Memes de Dota 2', args : '<meme>'},
  function(msg, args, command){
    basic.sendImageStructure(msg,args[1],links,args.until(1))
  })
