
const links = require('../../containers/stickers.json')

module.exports = {
  name: 'sticker',
  category: 'Fun',
  help: 'Pegatinas de Dota 2',
  args: '<sticker>',
  run: async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  }
}
