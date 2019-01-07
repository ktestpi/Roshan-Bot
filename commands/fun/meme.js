const { Command } = require('aghanim')
const links = require('../../containers/memes.json')

module.exports = new Command('meme',{
  category : 'Fun', help : 'Memes de Dota 2', args : '<meme>'},
  function(msg, args, command){
    return this.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  })
