const { SimpleEnums } = require('../classes/enums')

const GAMEMODE = {
  "0" : 'Unknown',
  "1" : 'All Pick',
  "2" : "Captain's Mode",
  "3" : 'Random Draft',
  "4" : 'Single Draft',
  "5" : 'All Random',
  "6"	: 'Intro',
  "7"	: 'Diretide',
  "8"	: 'Reverse Captain’s Mode',
  "9"	: 'The Greeviling',
  "10" : 'Tutorial',
  "11" : 'Mid Only',
  "12" : 'Least Played',
  "13" : 'New Player Pool',
  "14" : 'Compendium Matchmaking',
  "15" : 'Custom',
  "16" : 'Captains Draft',
  "17" : 'Balanced Draft',
  "18" : 'Ability Draft',
  "19" : 'Event (?)',
  "20" : 'All Random Death Match',
  "21" : 'Solo Mid 1 vs 1',
  "22" : 'Ranked All Pick',
  "23" : 'Turbo'
}

module.exports = new SimpleEnums(GAMEMODE)
