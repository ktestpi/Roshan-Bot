const enumFeeds = require('../../enums/feeds')

module.exports = {
  name: ['subscriptions','subs'],
  childOf: 'server',
  category: 'Server',
  help: 'Subscripciones disponibles',
  args: '',
  requirements: [
    {
      type: 'member.has.role',
      role: 'aegis',
      incaseSensitive: true
    }
  ],
  run: async function (msg, args, client, command){
    return msg.reply({
      embed: {
        title: 'server.subcriptionsavaliables',
        description: '<_description>'
      }
    }, {
      _description : enumFeeds.toArray().sort((a,b) => a.value.toLowerCase() > b.value.toLowerCase()).map(e => `\`${e.value}\``).join(', ')
    })
  }
}
