const { Command } = require('aghanim')

module.exports = {
  name: 'setlang',
  category : 'Account',
  help : 'Estable el idioma de la cuenta',
  args : '<idioma>',
  requirements: [
    'account.exist',
    {
      condition: (msg, args, client, command, req) => (args[1] || false) && client.components.Locale.languages.includes(args[1].toLowerCase()) && true,
      response: (msg, args, client, command, req) => msg.author.locale('lang.avaliables', {langs : client.components.Locale.flags().map(l => `${l.flag} \`${l.lang}\``).join(', ')})
    }
  ],
  run: async function (msg, args, client, command){
    return client.components.Account.modify(args.account._id, { lang: args[1].toLowerCase() })
          .then(() => msg.addReactionSuccess())

  }
}
