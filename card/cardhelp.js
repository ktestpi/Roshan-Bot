const { Command } = require('aghanim')
const lang = require('../lang.json')
const enumPlayerPos = require('../helpers/enums/player_positions')

module.exports = new Command('cardhelp',{
  category : 'Cuenta', help : 'Ayuda de la tarjeta de jugador@', args : ''},
  function(msg, args, command){
    msg.replyDM({
      embed : {
        title: lang.cardConfigTitle,
        description : lang.cardHelpCommand,
        fields : [
          {name : lang.cardHelpHeroesTitle , value : lang.cardHelpHeroesDesc, inline : false},
          {name : lang.cardHelpPositionTitle , value : `\`${enumPlayerPos.toArray().map(k => k.key).join(',')}\``, inline : false},
          {name : lang.cardHelpExampleTitle , value : lang.cardHelpExampleDesc, inline : false}
        ],
        color : this.config.color
      }
    })
  })
