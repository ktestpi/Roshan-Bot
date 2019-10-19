module.exports = {
  name: 'account',
  category : 'Account',
  help : 'Muestra/modifica tu cuenta',
  args : '[dotaID] [steamID]',
  requirements: ['account.exist'],
  run: async function(msg, args, client, command){
    return msg.replyDM({embed: {
            title: 'account.title',
            description: 'account.data',
            thumbnail: { url: '<user_avatar>' }
          }},{
              lang: msg.author.account.lang,
              supporter: msg.author.supporter ? `\n${msg.author.locale(client.config.emojis.supporter)}` : ''
            })
  }
}
