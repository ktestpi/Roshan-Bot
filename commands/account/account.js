const { Command } = require('aghanim')

module.exports = new Command('account',{
  category : 'Account', help : 'Muestra/modifica tu cuenta', args : '[dotaID] [steamID] [twithID] [twitterID]'},
  async function(msg, args, client, command){
    return client.components.Account.exists(msg.author.id)
      .then(account => {
        return msg.reply({embed: {
          title: 'account.title',
          description: 'account.data',
          thumbnail: { url: '<user_avatar>' }
        }},{
            lang: msg.author.account.lang,
            supporter: msg.author.supporter ? `\n${client.config.emojis.supporter}` : ''
          })
      })
  })
