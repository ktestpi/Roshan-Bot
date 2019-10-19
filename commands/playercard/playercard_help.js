const enumPlayerPos = require('../../enums/player_positions')

module.exports = {
  name: 'help', 
  childOf: 'playercard',
  category : 'Account',
  help : 'Ayuda de la tarjeta de jugador@',
  args : '',
  run: async function (msg, args, client, command){
    return msg.replyDM({
      embed: {
        title: 'playercard.help.title',
        description: 'playercard.help.cmd',
        fields: [
          { name: 'playercard.help.heroestitle', value: 'playercard.help.heroesdescription', inline: false },
          { name: 'playercard.help.positiontitle', value: '<_positions>', inline: false },
          { name: 'playercard.help.exampletitle', value: 'playercard.help.exampledescription', inline: false }
        ],
        footer: { text: 'playercard.roshancard', icon_url: '<bot_avatar>' }
      }
    }, {
      _positions: `\`${enumPlayerPos.toArray().map(k => k.key).join(',')}\``
    })
  }
}
