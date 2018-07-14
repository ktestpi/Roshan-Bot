const heroes = require('./heroes')
const {getHeroNameID} = require('./heroes')
const items = require('./items')
const medals = require('./medals')
const player_positions = require('./player_positions')
const card_bg = require('./card_bg')
module.exports = { heroes , heroesNameID : getHeroNameID, items, medals , player_positions, card_bg }
