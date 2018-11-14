const jimp = require('jimp')
const util = require('erisjs-utils')
const odutil = require('../opendota-util')
const enumHeroes = require('../enums/heroes')
const enumPlayerPos = require('../enums/player_positions')
const enumItems = require('../enums/items')
const enumCardBG = require('../enums/card_bg')
const enumMedals = require('../enums/medals')
const Canvas = require('./classes/canvas')
const loader = require('./loader')
const UNKNOWN = 'Unknown'

module.exports.matches = function(data_info){
  var jimps = [loadAsset('0','match_template')]
  // var jimps = [new jimp(SIZE_IMAGE.w, SIZE_IMAGE.h)]
  const [player,matches] = data_info
  const POSITION = {
    TABLE : {X : [50,30,145,220,240] , Y : 110},
    PLAYER : {NAMEX : 120, AVATARX : 40, Y : 20}
  }
  const MATCHES_START_INDEX = 4
  const LIMIT_MATCHES = 8
  jimps.push(jimp.loadFont(jimp.FONT_SANS_16_WHITE))
  jimps.push(jimp.loadFont(__dirname+'/fonts/open-sans-16-yellow/open-sans-16-yellow.fnt'))
  jimps.push(Promise.all([jimp.read(player.profile.avatarmedium),player.profile.personaname || UNKNOWN]))
  for (var i = 0; i < LIMIT_MATCHES; i++) {
    const match = matches[i]
    jimps.push(Promise.all([
      loadAsset(match.hero_id,'hero'),
      opendota.util.winOrLose(matches[i].radiant_win,matches[i].player_slot).slice(0,1),
      match.kills + ' / ' + match.deaths + ' / ' + match.assists,
      odutil.durationTime(matches[i].duration),
      match.match_id
    ]))
  }
  return new Promise((resolve,reject) => {
    Promise.all(jimps).then(data => {
      for (var i = MATCHES_START_INDEX; i < jimps.length; i++) {
        const y = (i-MATCHES_START_INDEX)*HERO_HEIGHT + POSITION.TABLE.Y
        for (var j = 0; j < data[i].length; j++) {
          let x = POSITION.TABLE.X[j]
          if(data[i][j] instanceof jimp){data[0].composite(data[i][j],x,y)}
          else if(['string','number'].includes(typeof(data[i][j]))){
            let texter = new Texter(data[i][j],x,y).alignVPic()
            if(j === 3){texter = texter.alignH('right',null,7)}
            else if(j === 4){texter = texter.alignH('left')}
            else{texter = texter.centerX()}
            data[0].print(data[1],texter.x,texter.y,texter.text)
          }
        }
      }
      // const footerInfo = `Duración: ${odutil.durationTime(data_info.duration)}  -  ID: ${data_info.match_id}  -  Jugada: ${util.date(data_info.start_time*1000,'hm/DMY')}`
      // odutil.durationTime(results[0].duration), time : util.date(results[0].start_time*1000,'hm/DMY')},true),
      // data[0].print(data[11],textCenter('ID: ' + data_info.match_id,350),POSITION_Y_MATCH_ID,'ID: ' + data_info.match_id)
      // data[0].print(data[11],textCenter(footerInfo,350),POSITION_Y_MATCH_ID,footerInfo)
      // data[0].write('test.jpg')
      data[0].composite(data[3][0],POSITION.PLAYER.AVATARX,POSITION.PLAYER.Y)

      data[0].print(data[1],POSITION.PLAYER.NAMEX,new Texter(data[3][1],POSITION.PLAYER.NAMEX,POSITION.PLAYER.Y).centerYImg(data[3][0].bitmap.height).y,data[3][1])
      data[0].getBuffer(jimp.MIME_JPEG,function(err,buffer){resolve(buffer)})//.then(buffer => resolve(buffer))
    }).catch(err => {})
  })



  // const PATH = 'heroes'
  // const PATH_RESULT = 'heroes_converted'
  // console.log(__dirname);
  // const folderBase = __dirname + '/' + PATH + '/'
  // const pattern = folderBase +'*.jpg'
  // var filenames = glob.sync(pattern)
  //
  // // filenames = filenames.map(f => f.replace(__dirname + '/',''))
  // // console.log(filenames);
  //
  // filenames.forEach(f => {
  //   const basename = path.basename(f);
  //   // console.log(basename);
  //   jimp.read(f).then(data => data.resize(48,jimp.AUTO).quality(100).write(PATH_RESULT + '/' + basename))
  // })
}

module.exports = function(info){
  // var jimps = [new jimp(400,180,0x000000FF)]
  const [player,card] = info
  var jimps = [Promise.all([loader.cardBG(card.bg),loader.cardTemplate()])]
  jimps.push(Promise.all([jimp.loadFont(jimp.FONT_SANS_32_WHITE),jimp.loadFont(jimp.FONT_SANS_16_WHITE)]))
  jimps.push(Promise.all([loader.logo('dota2_16x16'),loader.logo('steam_16x16')]))
  jimps.push(loader._load(player.profile.avatarfull))
  jimps.push(loader.medal({rank : player.rank_tier, leaderboard : player.leaderboard_rank}))
  if(card.heroes.split(',').length > 0){
    const heroes = []
    card.heroes.split(',').forEach(hero => {
      heroes.push(loader.minihero(hero))
    })
    jimps.push(Promise.all(heroes))
  }
  return new Promise((resolve,reject) => {
    return Promise.all(jimps).then(data => {
      let canvas = new Canvas(data[0][0],{w16 : data[1][0], w8 : data[1][1]})
      let template = canvas.paint('template',data[0][1]).add()
      let avatar = canvas.paint('avatar',data[3].resize(jimp.AUTO,96))
      let medal = canvas.paint('medal',data[4].resize(jimp.AUTO,64)).place(avatar,'cxby',{y : -16}).log()
      let leaderboard
      // let group_avatar = [avatar]
      let group_avatar = [avatar,medal]
      if(player.leaderboard_rank){
        leaderboard = canvas.write('leaderboard','#' + player.leaderboard_rank,'w8').place(medal,'rx',{x : 5}).place(avatar,'by',{y : 0});
        group_avatar.push(leaderboard)
      }
      group_avatar = canvas.group('group_avatar',group_avatar).set(canvas,'lxty',{x : 20 , y : 20})
      let namePlayer = canvas.write('namePlayer',player.profile.personaname,'w16').cut(15)
      let positionPlayer = canvas.write('positionPlayer',enumPlayerPos.getValue(card.pos),'w8').place(namePlayer,'by',{y : 5})
      let hero1 = canvas.paint('hero1',data[5][0].resize(jimp.AUTO,28)).place(positionPlayer,'by',{ y : 8})
      let hero2 = canvas.paint('hero2',data[5][1].resize(jimp.AUTO,28)).place(hero1,'rxty',{ x : 5, y : 0})
      let hero3 = canvas.paint('hero3',data[5][2].resize(jimp.AUTO,28)).place(hero2,'rxty',{ x : 5, y : 0})
      canvas.group('playerInfo',[namePlayer,positionPlayer,hero1,hero2,hero3]).set(avatar,'rxty',{x : 14, y : 0})

      let dotaAvatar = canvas.paint('dotaAvatar',data[2][0].resize(jimp.AUTO,16))
      let dotaID = canvas.write('dotaID',player.profile.account_id.toString(),'w8').place(dotaAvatar,'rx', {x : 4})
      let steamAvatar = canvas.paint('steamAvatar',data[2][1].resize(jimp.AUTO,16)).place(dotaID,'rx',{ x : 4})
      let steamID = canvas.write('steamID',player.profile.steamid,'w8').place(steamAvatar,'rx', {x : 4})
      canvas.group('playerID',[dotaAvatar,dotaID,steamAvatar,steamID]).place(canvas,'gxr',{x : 10}).set(canvas,'gyb',{y : 12})

      canvas.create('png').then(buff => resolve(buff)).catch(err => reject(err))
    })
  })
}
