const jimp = require('jimp')
const util = require('erisjs-utils')
const odutil = require('../helpers/opendota-utils')
const enumHeroes = require('../enums/heroes')
const enumPlayerPos = require('../enums/player_positions')
const enumItems = require('../enums/items')
const enumCardBG = require('../enums/card_bg')
const enumMedals = require('../enums/medals')
const Canvas = require('../classes/paintjimp/canvas')
const loader = require('./loader')
const UNKNOWN = 'Unknown'

module.exports = function(data_info){
  const [player,matches] = data_info
  var jimps = [new jimp(350,300,0x303030FF)]
  // var jimps = [new jimp(SIZE_IMAGE.w, SIZE_IMAGE.h)]
  jimps.push(Promise.all([loader.fontLoad('w32'), loader.fontLoad('w16')]))
  const POSITION = {
    TABLE : {X: 10, Y : 40},
    PLAYER : {NAMEX : 120, AVATARX : 40, Y : 10}
  }
  const MATCHES_START_INDEX = 3
  const LIMIT_MATCHES = 10
  const HERO_HEIGHT = 24
  jimps.push(Promise.all([jimp.read(player.profile.avatarmedium),player.profile.personaname || UNKNOWN]))
  for (var i = 0; i < LIMIT_MATCHES; i++) {
    const match = matches[i]
    jimps.push(Promise.all([
      loader.hero(match.hero_id),
      odutil.winOrLose(match.radiant_win,match.player_slot).slice(0,1),
      match.kills + ' / ' + match.deaths + ' / ' + match.assists,
      odutil.durationTime(matches[i].duration),
      match.match_id
    ]))
  }
  return Promise.all(jimps).then(data => {
    const canvas = new Canvas(data[0],{w32 : data[1][0], w16 : data[1][1]})
    const player_avatar = canvas.paint('player_avatar', data[2][0].resize(24, jimp.AUTO))
    const player_name = canvas.write('player_name', data[2][1], 'w16').place(player_avatar, 'rxcy', {x: 10})
    const player_group = canvas.group('player_group', [player_avatar, player_name]).set(canvas, 'cxty', {y: 10})
    for (var i = MATCHES_START_INDEX, l = jimps.length; i < l; i++) {
      const y = (i-MATCHES_START_INDEX)*(HERO_HEIGHT + 2) + POSITION.TABLE.Y
      const match = data[i]
      const heroimg = canvas.paint('heroimg', match[0].resize(jimp.AUTO,24), {x: POSITION.TABLE.X, y}).add()
      const victory = canvas.write('victory',match[1],'w16').set(heroimg,'rxcy', {x: 10})
      const kda = canvas.write('kda',match[2],'w16', {x: 130}).place(null,'csx').set(heroimg,'cy')
      const duration = canvas.write('duration',match[3],'w16', {x: 200}).place(null,'csx').set(heroimg,'cy')
      const match_id = canvas.write('match_id',match[4],'w16', {x: duration.x + duration.w + 10}).place(canvas, 'gxr', {x: 10}).set(heroimg,'cy')
    }
    return canvas.create('jpg')
  })
}
