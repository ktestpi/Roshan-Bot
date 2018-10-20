const { Command } = require('aghanim')
const enumPlayerPos = require('../../enums/player_positions')

module.exports = new Command('idcardhelp',{
  category : 'Account', help : 'Ayuda de la tarjeta de jugador@', args : ''},
  function(msg, args, command){
    const lang = this.locale.getUserStrings(msg)
    return msg.replyDM({
      embed : {
        title: lang.cardConfigTitle,
        description : lang.cardHelpCommand,
        fields : [
          {name : lang.cardHelpHeroesTitle, value : lang.cardHelpHeroesDesc, inline : false},
          {name : lang.cardHelpPositionTitle , value : `\`${enumPlayerPos.toArray().map(k => k.key).join(',')}\``, inline : false},
          {name : lang.cardHelpExampleTitle , value : lang.cardHelpExampleDesc, inline : false}
        ],
        color : this.config.color
      }
    })
  })
