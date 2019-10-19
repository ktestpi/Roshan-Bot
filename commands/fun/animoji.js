const links = require('../../containers/emojis.json')

module.exports = {
  name: 'animoji',
  category : 'Fun',
  help : 'Emojis animados de Dota 2',
  args : '<emoji>',
  run: async function (msg, args, client, command){
    return client.components.Bot.sendImageStructure(msg,args[1],links,args.until(1))
  }
}
