const { Command } = require('aghanim')
const links = require('../../containers/charms.json')

module.exports = new Command('anicharm',{
  category : 'Fun', help : 'Emojis animados brillantes de Dota 2', args : '<emoji>'},
  async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  })
