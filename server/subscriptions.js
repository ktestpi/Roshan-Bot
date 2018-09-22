const { Command } = require('aghanim')
const lang = require('../lang.json')
const enumFeeds = require('../helpers/enums/feeds')

module.exports = new Command(['subscriptions','subs'],{subcommandFrom : 'server',
  category : 'Server', help : 'Subscripciones disponibles', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    // let self = this
    msg.reply({embed : {
      title : lang.serverSubcriptionsAvaliables,
      description : enumFeeds.toArray().sort((a,b) => a.value.toLowerCase() > b.value.toLowerCase()).map(e => `\`${e.value}\``).join(', '),
      color : this.config.color
    }
    })
  })
