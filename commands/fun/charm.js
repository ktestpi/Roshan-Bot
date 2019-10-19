
const links = require('../../containers/charms.json')

module.exports = {
  name: 'anicharm',
  category: 'Fun',
  help: 'Emojis animados brillantes de Dota 2',
  args: '<emoji>',
  run: async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  }
}
