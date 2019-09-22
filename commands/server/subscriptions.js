const { Command } = require('aghanim')
const enumFeeds = require('../../enums/feeds')

module.exports = new Command(['subscriptions','subs'],{subcommandFrom : 'server',
  category : 'Server', help : 'Subscripciones disponibles', args : '',
  rolesCanUse: 'aegis'},
  async function (msg, args, client, command){
    return msg.reply({
      embed: {
        title: 'server.subcriptionsavaliables',
        description: '<_description>'
      }
    }, {
      _description : enumFeeds.toArray().sort((a,b) => a.value.toLowerCase() > b.value.toLowerCase()).map(e => `\`${e.value}\``).join(', ')
    })
  })
