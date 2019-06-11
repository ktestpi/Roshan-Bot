const { Command } = require('aghanim')
const { Datee , Request} = require('erisjs-utils')

module.exports = new Command('setlang',{
  category : 'Account', help : 'Estable el idioma de la cuenta', args : '<idioma>'},
  async function (msg, args, client, command){
    return client.components.Account.exists(msg.author.id)
      .then(account => {
        if(!args[1] || !client.components.Locale.languages.includes(args[1].toLowerCase())){
          return msg.reply('lang.avaliables',{langs : client.components.Locale.flags().map(l => `${l.flag} \`${l.lang}\``).join(', ')})
        }
        return client.components.Account.modify(account._id, { lang: args[1].toLowerCase() })
          .then(() => msg.addReactionSuccess())
      })
  })
