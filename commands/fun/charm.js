const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const links = require('../../containers/charms.json')

module.exports = new Command('anicharm',{
  category : 'Fun', help : 'Emojis animados brillantes de Dota 2', args : '<emoji>'},
  function(msg, args, command){
    return basic.sendImageStructure(msg,args[1],links,args.until(1))
  })
