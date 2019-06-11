const { Command } = require('aghanim')
const enumFeeds = require('../../enums/feeds')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'server.subcriptionsavaliables',
  description: '<_description>'
})

module.exports = new Command(['subscriptions','subs'],{subcommandFrom : 'server',
  category : 'Server', help : 'Subscripciones disponibles', args : '',
  rolesCanUse: 'aegis'},
  async function (msg, args, client, command){
    return msg.reply(embed, {
      _description : enumFeeds.toArray().sort((a,b) => a.value.toLowerCase() > b.value.toLowerCase()).map(e => `\`${e.value}\``).join(', ')
    })
  })
