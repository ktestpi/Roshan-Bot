const { Command } = require('aghanim')
const {Datee , Request} = require('erisjs-utils')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'account.title',
  description: 'account.data',
  thumbnail: {url : '<user_avatar>'}

})

module.exports = new Command('account',{
  category : 'Account', help : 'Muestra/modifica tu cuenta', args : '[dotaID] [steamID] [twithID] [twitterID]'},
  async function(msg, args, client, command){
    return client.components.Account.exists(msg.author.id)
      .then(account => {
        return msg.reply(embed,{
            lang: msg.author.account.lang,
            supporter: msg.author.supporter ? `\n${client.config.emojis.supporter}` : ''
          })
      })
  })
