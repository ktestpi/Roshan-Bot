const jimp = require('jimp')
const enumHeroes = require('../enums/heroes')
const enumPlayerPos = require('../enums/player_positions')
const enumItems = require('../enums/items')
const enumCardBG = require('../enums/card_bg')
const enumMedals = require('../enums/medals')
const AssetLoader = require('./classes/assetloader')

const loader = new AssetLoader('./img/',{
  hero : {path : 'heroes', ext : 'jpg', conversor : (input) => enumHeroes.getValue(input).name_id},
  minihero : {path : 'miniheroes', ext : 'png', conversor : (input) => enumHeroes.getValue(input).name_id},
  logo : {path : 'logos', ext : 'png'},
  item : {path : 'items', ext : 'jpg', conversor : (input) => enumItems.getValue(input)},
  cardBG : {path : 'cards', ext : 'jpg', conversor : (input) => enumCardBG.getValue(input)},
  cardTemplate : {path : 'templates/card', ext : 'png', default : 'default'},
  matchTemplate : {path : 'templates/match', ext : 'jpg', default : '1'},
  medal : { path : 'medals', ext : 'png', conversor : (input) => enumMedals(input).compose}
})

loader._enum = {
  fonts : {
    y16 : './helpers/apijimp/fonts/open-sans-16-yellow/open-sans-16-yellow.fnt',
    w32 : jimp.FONT_SANS_32_WHITE,
    w16 : jimp.FONT_SANS_16_WHITE,
    w8 : jimp.FONT_SANS_8_WHITE
  }
}


loader.fontLoad = function(font){return this.font(this._enum.fonts[font])}

module.exports = loader
