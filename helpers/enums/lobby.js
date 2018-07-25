const { SimpleEnums } = require('../classes/enums')

const LOBBYTYPE = {
  "-1" : 'Invalid',
  "0" : 'Pública', //Public matchmaking
  "1" : 'Practica',
  "2" : 'Torneo',
  "3" : 'Tutorial',
  "4" : 'Co-op con IA',
  "5" : 'Partida de equipo',
  "6" : 'Solo cola',
  "7" : 'Ranked', //Ranked matchmaking
  "8" : 'Solo Mid 1 vs 1'
}

module.exports = new SimpleEnums(LOBBYTYPE)
