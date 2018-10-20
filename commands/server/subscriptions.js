const { Command } = require('aghanim')
const enumFeeds = require('../../enums/feeds')

module.exports = new Command(['subscriptions','subs'],{subcommandFrom : 'server',
  category : 'Server', help : 'Subscripciones disponibles', args : '',
  rolesCanUse: 'aegis'},
  function(msg, args, command){
    // let self = this
    msg.reply({embed : {
      title : this.locale.getChannelString('serverSubcriptionsAvaliables',msg),
      description : enumFeeds.toArray().sort((a,b) => a.value.toLowerCase() > b.value.toLowerCase()).map(e => `\`${e.value}\``).join(', '),
      color : this.config.color
    }
    })
  })
