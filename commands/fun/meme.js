const { Command } = require('aghanim')
const links = require('../../containers/memes.json')

module.exports = new Command('meme',{
  category : 'Fun', help : 'Memes de Dota 2', args : '<meme>'},
  async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  })
