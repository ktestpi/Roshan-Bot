const enumPlayerBg = require('../../enums/card_bg')

module.exports = {
  name: 'setbg',
  childOf: 'playercard',
  category: 'Account',
  help: 'Configura el fondo de la tarjeta de jugador',
  args: '',
  requirements: [{
    validate: (msg, args, client, command, req) => args[2] || false,
    response: (msg, args, client, command, req) => msg.author.locale('playercard.setbg.gallery')
  },"account.exist", "account.registered", "account.supporter"],
  run: async function (msg, args, client, command){
      const bg = enumPlayerBg.getKey(args[2])
      if(!bg){return msg.reply('playercard.bgnotexist')}
      return client.components.Account.modify(msg.author.id, { card: { bg }})
        .then(() => msg.addReactionSuccess())
  }
}
