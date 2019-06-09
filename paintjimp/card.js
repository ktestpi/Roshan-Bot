const jimp = require('jimp')
const enumHeroes = require('../enums/heroes')
const enumPlayerPos = require('../enums/player_positions')
const enumItems = require('../enums/items')
const enumCardBG = require('../enums/card_bg')
const enumMedals = require('../enums/medals')
const Canvas = require('../classes/paintjimp/canvas')
const loader = require('../paintjimp/loader')
const UNKNOWN = 'Unknown'

module.exports = function(info){
  // var jimps = [new jimp(400,180,0x000000FF)]
  const [player,card] = info
  var jimps = [Promise.all([loader.cardBG(card.bg),loader.cardTemplate()])]
  jimps.push(Promise.all([loader.fontLoad('w32'),loader.fontLoad('w16')]))
  jimps.push(Promise.all([loader.logo('dota2_16x16'),loader.logo('steam_16x16')]))
  jimps.push(loader.read(player.profile.avatarfull))
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
      let medal = canvas.paint('medal',data[4].resize(jimp.AUTO,64)).place(avatar,'cxby',{y : -16})
      let leaderboard
      // // let group_avatar = [avatar]
      let group_avatar = [avatar,medal]
      if(player.leaderboard_rank){
        leaderboard = canvas.write('leaderboard','#' + player.leaderboard_rank,'w8').place(medal,'rx',{x : 5}).place(avatar,'by',{y : 0});
        group_avatar.push(leaderboard)
      }
      group_avatar = canvas.group('group_avatar',group_avatar).set(canvas,'lxty',{x : 20 , y : 20})
      let namePlayer = canvas.write('namePlayer',player.profile.personaname,'w16').sliceUntil(15)
      let positionPlayer = canvas.write('positionPlayer',enumPlayerPos.getValue(card.pos),'w8').place(namePlayer,'by',{y : 5})
      let hero1 = canvas.paint('hero1',data[5][0].resize(jimp.AUTO,28)).place(positionPlayer,'by',{ y : 8})
      let hero2 = canvas.paint('hero2',data[5][1].resize(jimp.AUTO,28)).place(hero1,'rxty',{ x : 5, y : 0})
      let hero3 = canvas.paint('hero3',data[5][2].resize(jimp.AUTO,28)).place(hero2,'rxty',{ x : 5, y : 0})
      canvas.group('playerInfo',[namePlayer,positionPlayer,hero1,hero2,hero3]).set(avatar,'rxty',{x : 14, y : 0})
      //
      let dotaAvatar = canvas.paint('dotaAvatar',data[2][0].resize(jimp.AUTO,16))
      let dotaID = canvas.write('dotaID',player.profile.account_id.toString(),'w8').place(dotaAvatar,'rx', {x : 4})
      let steamAvatar = canvas.paint('steamAvatar',data[2][1].resize(jimp.AUTO,16)).place(dotaID,'rx',{ x : 4})
      let steamID = canvas.write('steamID',player.profile.steamid,'w8').place(steamAvatar,'rx', {x : 4})
      canvas.group('playerID',[dotaAvatar,dotaID,steamAvatar,steamID]).place(canvas,'gxr',{x : 10}).set(canvas,'gyb',{y : 12})
      canvas.create('png').then(buff => resolve(buff)).catch(err => reject(err))
    })
  })
}
