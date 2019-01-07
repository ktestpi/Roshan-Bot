const { Command } = require('aghanim')
const links = require('../../containers/charms.json')

module.exports = new Command('anicharm',{
  category : 'Fun', help : 'Emojis animados brillantes de Dota 2', args : '<emoji>'},
  function(msg, args, command){
    return this.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  })
