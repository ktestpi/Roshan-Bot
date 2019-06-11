const { Command } = require('aghanim')
const enumPlayerBg = require('../../enums/card_bg')

module.exports = new Command('setbg', {
  subcommandFrom: 'playercard',
  category : 'Account', help : 'Configura el fondo de la tarjeta de jugador', args : '',
  check : async function(msg, args, client){
    if(!msg.author.registered){
      await msg.reply('bot.needregister')
      return false
    }
    if(!msg.author.supporter){
      await msg.reply('roshan.supporter.need')
      return false
    }else{
      return true
    }
  }},
  async function (msg, args, client, command){
    if (args[2]){
      const bg = enumPlayerBg.getKey(args[2])
      if(!bg){return} //TODO bg doesn't exist
      return client.components.Account.exists(msg.author.id)
        .then(account => client.components.Account.modify(msg.author.id, { card: { bg }}))
        .then(() => msg.addReactionSuccess())
    }else{
      return msg.reply('playercard.setbg.gallery')
    }
  })
