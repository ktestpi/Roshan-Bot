const { SimpleEnums } = require('../classes/enums')

const LOBBYTYPE = {
  "-1" : 'Invalid',
  "0" : 'Public', //Public matchmaking
  "1" : 'Practice',
  "2" : 'Torneo',
  "3" : 'Tutorial',
  "4" : 'IA Co-op',
  "5" : 'Team match',
  "6" : 'Solo queue',
  "7" : 'Ranked', //Ranked matchmaking
  "8" : 'Solo Mid 1 vs 1'
}

module.exports = new SimpleEnums(LOBBYTYPE)
