const { Command } = require('aghanim')
const links = require('../../containers/stickers.json')

module.exports = new Command('sticker',{
  category : 'Fun', help : 'Pegatinas de Dota 2', args : '<sticker>'},
  async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  })
