const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const lang = require('../lang.json')
const enumPlayerPos = require('../helpers/enums/player_positions')

module.exports = new Command('cardhelp',{
  category : 'Cuenta', help : 'Ayuda de la tarjeta de jugador@', args : ''},
  function(msg, args, command){
    let self = this
    msg.replyDM({
      embed : {
        title: 'Card - Ayuda',
        description : 'Comando: r!cardset <argumentos>',
        fields : [
          {name : 'Héroes (.)' , value : '`am,axe,kotl...`', inline : false},
          {name : 'Posición (-)' , value : `\`${enumPlayerPos.array.map(k => k._id).join(',')}\``, inline : false},
          {name : 'Nombre ("...")' , value : '"Nombre del jugador"', inline : false},
          {name : 'Ejemplos' , value : '`r!cardset .am .lina .invoker -sup`', inline : false}
        ],
        color : this.config.color
      }
    })
  })
