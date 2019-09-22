const jimp = require('jimp')
const { Datee, Number} = require('erisjs-utils')
const odutil = require('../helpers/opendota-utils')
const Canvas = require('../classes/paintjimp/canvas')
const loader = require('./loader')

const UNKNOWN = 'Unknown'

module.exports = function(data_info){
  const LINE_HEIGHT = 24, ITEM_WIDTH = 33, SPACE_TEAMS_Y = 10
  var jimps = [loader.matchTemplate('1')]
  const info = data_info.players.map(p => jimps.push(Promise.all([
    loader.hero(p.hero_id),
    p.name || p.personaname || UNKNOWN,
    p.kills,
    p.deaths,
    p.assists,
    p.gold_per_min,
    p.xp_per_min,
    p.last_hits + ' / ' + p.denies,
    Number.tok(p.hero_damage) + ' / ' + Number.tok(p.tower_damage),
    Promise.all([
      loader.item(p.item_0),
      loader.item(p.item_1),
      loader.item(p.item_2),
      loader.item(p.item_3),
      loader.item(p.item_4),
      loader.item(p.item_5)])
  ])))
  jimps[11] = loader.fontLoad('w16')//jimp.loadFont(jimp.FONT_SANS_16_WHITE)
  jimps[12] = loader.fontLoad('y16')//loadAsset('open-sans-yellow','font')//jimp.loadFont(__dirname+'/fonts/open-sans-16-yellow/open-sans-16-yellow.fnt')
  jimps[13]= loader.read('./img/templates/match/victory_' + (data_info.radiant_win ? 'radiant' : 'dire') + '.png')

  return new Promise((resolve,reject) => {
    return Promise.all(jimps).then(data => {
      try{
        let canvas = new Canvas(data[0],{w16 : data[11], y16 : data[12]})
        let winnerTeam = canvas.paint('winnerTeam',data[13],{x : 0, y : 0}).add()
        const footerInfo = `Duration: ${odutil.durationTime(data_info.duration)}  -  ID: ${data_info.match_id}  -  Played: ${Datee.custom(data_info.start_time*1000,'h:m D/M/Y',true)}`
        const infoMatch = canvas.write('infoMatch',footerInfo,'w16').set(canvas,'cxgyb',{ x : 0, y : 10})
        const refTable = canvas.ref('refTable',{x : 12 , y : 40})
        for (var i = 1; i < 11; i++) {
          const minihero = canvas.paint('minihero'+i,data[i][0].resize(43,jimp.AUTO)).set(refTable,'rxty',{ x : 0, y : (i-1)*LINE_HEIGHT + (i > 5 ? SPACE_TEAMS_Y : 0)})
          const playername = canvas.write('playername'+i,data[i][1],'w16').sliceUntil(15).set(minihero,'rxcy',{ x : 4, y : 0 })
          const k = canvas.write('k'+i,data[i][2],'w16',{x : 202, y : playername.y}).set(null,'csx')
          const d = canvas.write('k'+i,data[i][3],'w16',{x : 222, y : playername.y}).set(null,'csx')
          const a = canvas.write('a'+i,data[i][4],'w16',{x : 242, y : playername.y}).set(null,'csx')
          const gpm = canvas.write('gpm'+i,data[i][5],'y16',{x : 273, y : playername.y}).set(null,'csx')
          const xpm = canvas.write('xpm'+i,data[i][6],'w16',{x : 313, y : playername.y}).set(null,'csx')
          const lhd = canvas.write('lhd'+i,data[i][7],'w16',{x : 366, y : playername.y}).set(null,'csx')
          const hdtd = canvas.write('hdtd'+i,data[i][8],'w16',{x : 443, y : playername.y}).set(null,'csx')
          data[i][9].filter(i => i).forEach((item,itemIndex) => {
            canvas.paint('player' + i + 'item' + itemIndex, item.resize(33, jimp.AUTO),{x : 493 + itemIndex*ITEM_WIDTH, y : minihero.y}).add()
          })
        }
        canvas.create('png').then(buff => resolve(buff)).catch(err => reject(err))
      }catch(err){
        reject(err)
      }
    })
  })
}
