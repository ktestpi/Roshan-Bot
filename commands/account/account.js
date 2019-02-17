const { Command } = require('aghanim')
const {Datee , Request} = require('erisjs-utils')
const EmbedBuilder = require('../../classes/embed-builder.js')

const embed = new EmbedBuilder({
  title: 'account.title',
  description: 'account.data',
  thumbnail: {url : '<_user_avatar>'}
})

module.exports = new Command('account',{
  category : 'Account', help : 'Muestra/modifica tu cuenta', args : '[dotaID] [steamID] [twithID] [twitterID]'},
  async function(msg, args, client, command){
    return client.components.Account.exists(msg.author.id)
      .then(account => {
        if(!account){return command.error()}
        return msg.replyDM(embed,{
            dotaID: account.dota,
            steamID : account.steam,
            lang: client.locale.getUserFlag(account.lang),
            _user_avatar: msg.author.avatarURL,
            supporter: client.locale.replacer(msg.author.supporter ? `\n${client.config.emojis.supporter}` : '')
          })
      })
  })
