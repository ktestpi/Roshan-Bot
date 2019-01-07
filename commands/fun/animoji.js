const { Command } = require('aghanim')
const links = require('../../containers/emojis.json')

module.exports = new Command('animoji',{
  category : 'Fun', help : 'Emojis animados de Dota 2', args : '<emoji>'},
  function(msg, args, command){
    return this.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  })
