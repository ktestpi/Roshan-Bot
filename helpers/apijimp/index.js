const jimp = require('jimp')
const ids = require('./getimg')
const util = require('erisjs-utils')
const basic = require('../basic')
const opendota = require('../opendota')

const SIZE_IMAGE = { w : 700 , h : 322}
const ITEM_WIDTH = 33
const ITEM_HEIGHT = 24
const HERO_WIDTH = 50
const HERO_HEIGHT = 24
const SPACE = {"s4" : 4, "s6" : 6}
const CHARS_LIMIT_NAME = 15
const CHARS_LIMIT = 15
const UNKNOWN = 'Desconocid@'

function loadImages(images){
  // console.log(images);
  return Promise.all(images.map((v,k) => {
    // console.log(k,v);
    if(k === 0){
      // console.log(v);
      return jimp.read('./img/heroes/'+ v + '.jpg')
    }else if(k > 0 && k < 7){
      return v ? jimp.read('./img/items/'+ v + '.jpg') : null
    }else{
      return v
    }
  }))
}


module.exports.match = function(data_info){
  const POSITION = {
    TABLE : {Y : 40 , X : 12},
    SPACE_TEAMS_Y : 8,
    ITEMS_X : 460,
    STATS : [0,140,160,180,210,250,310,390],
    MATCH_ID_Y : 292
  }
  var jimps = [jimp.read('./img/match_template.jpg')]
  // console.log(data_info.players);
  const info = data_info.players.map(p => jimps.push(Promise.all([
    loadAsset(p.hero_id,'hero'),
    loadAsset(p.item_0,'item'),
    loadAsset(p.item_1,'item'),
    loadAsset(p.item_2,'item'),
    loadAsset(p.item_3,'item'),
    loadAsset(p.item_4,'item'),
    loadAsset(p.item_5,'item'),
    p.personaname || UNKNOWN,
    p.kills,
    p.deaths,
    p.assists,
    p.gold_per_min,
    p.xp_per_min,
    p.last_hits + ' / ' + p.denies,
    numberToK(p.hero_damage) + ' / ' + numberToK(p.tower_damage)
  ])))
  jimps[11] = jimp.loadFont(jimp.FONT_SANS_16_WHITE)
  jimps[12] = jimp.loadFont(__dirname+'/fonts/open-sans-16-yellow/open-sans-16-yellow.fnt')
  jimps[13]= jimp.read('./img/victory_' + (data_info.radiant_win ? 'radiant' : 'dire') + '.png')
  // console.log(jimps);

  return new Promise((resolve,reject) => {
    Promise.all(jimps).then(data => {
      for (var i = 1; i < 11; i++) {
        const y = (i-1)*ITEM_HEIGHT + POSITION.TABLE.Y + (i > 5 ? POSITION.SPACE_TEAMS_Y : 0)
        // console.log('y',y);
        for (var j = 0; j < data[i].length; j++) {
          let x = j === 0 ? POSITION.TABLE.X : POSITION.ITEMS_X + ITEM_WIDTH*j
          if(data[i][j] instanceof jimp){data[0].composite(data[i][j],x,y)}
          else if(['string','number'].includes(typeof(data[i][j]))){
            let sx = POSITION.TABLE.X+HERO_WIDTH + POSITION.STATS[j-7]
            let texter = new Texter(data[i][j]+'',sx,y)
            if(j === 7){text = texter.slice()}
            if(j > 7){text = texter.centerX()}
            // console.log(data[i][j]);
            data[0].print(j !== 11 ? data[11] : data[12],texter.x,texter.y,texter.text)
          }
        }
      }
      const footerInfo = `Duración: ${basic.durationTime(data_info.duration)}  -  ID: ${data_info.match_id}  -  Jugada: ${util.date(data_info.start_time*1000,'hm/DMY')}`
      // basic.durationTime(results[0].duration), time : util.date(results[0].start_time*1000,'hm/DMY')},true),
      // data[0].print(data[11],textCenter('ID: ' + data_info.match_id,350),POSITION_Y_MATCH_ID,'ID: ' + data_info.match_id)
      data[0].print(data[11],textCenter(footerInfo,350),POSITION.MATCH_ID_Y,footerInfo)
      data[0].composite(data[13],0,0)
      // data[0].write('test.jpg')
      data[0].getBuffer(jimp.MIME_JPEG,function(err,buffer){resolve(buffer)})//.then(buffer => resolve(buffer))
    })
  })

}

module.exports.matches = function(data_info){
  // console.log(data_info);
  var jimps = [new jimp.read('./img/matches_template.jpg')]
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
  // console.log(matches[0]);
  for (var i = 0; i < LIMIT_MATCHES; i++) {
    const match = matches[i]
    jimps.push(Promise.all([
      loadAsset(match.hero_id,'hero'),
      opendota.util.winOrLose(matches[i].radiant_win,matches[i].player_slot).slice(0,1),
      match.kills + ' / ' + match.deaths + ' / ' + match.assists,
      basic.durationTime(matches[i].duration),
      match.match_id
    ]))
  }
  return new Promise((resolve,reject) => {
    Promise.all(jimps).then(data => {
      for (var i = MATCHES_START_INDEX; i < jimps.length; i++) {
        // const y = (i-1)*ITEM_HEIGHT + POSITION_Y_TABLE + (i > 5 ? POSITION_Y_SPACE_TEAMS : 0)
        const y = (i-MATCHES_START_INDEX)*HERO_HEIGHT + POSITION.TABLE.Y
        // console.log('y',y);
        for (var j = 0; j < data[i].length; j++) {
          let x = POSITION.TABLE.X[j]
          if(data[i][j] instanceof jimp){data[0].composite(data[i][j],x,y)}
          else if(['string','number'].includes(typeof(data[i][j]))){
            let texter = new Texter(data[i][j],x,y).alignVPic()
            if(j === 3){texter = texter.alignH('right',null,7)}
            else if(j === 4){texter = texter.alignH('left')}
            else{texter = texter.centerX()}
            // console.log('TEXTER',texter);
            data[0].print(data[1],texter.x,texter.y,texter.text)
          }
        }
      }
      // const footerInfo = `Duración: ${basic.durationTime(data_info.duration)}  -  ID: ${data_info.match_id}  -  Jugada: ${util.date(data_info.start_time*1000,'hm/DMY')}`
      // basic.durationTime(results[0].duration), time : util.date(results[0].start_time*1000,'hm/DMY')},true),
      // data[0].print(data[11],textCenter('ID: ' + data_info.match_id,350),POSITION_Y_MATCH_ID,'ID: ' + data_info.match_id)
      // data[0].print(data[11],textCenter(footerInfo,350),POSITION_Y_MATCH_ID,footerInfo)
      // data[0].write('test.jpg')
      data[0].composite(data[3][0],POSITION.PLAYER.AVATARX,POSITION.PLAYER.Y)

      data[0].print(data[1],POSITION.PLAYER.NAMEX,new Texter(data[3][1],POSITION.PLAYER.NAMEX,POSITION.PLAYER.Y).centerYImg(data[3][0].bitmap.height).y,data[3][1])
      data[0].getBuffer(jimp.MIME_JPEG,function(err,buffer){resolve(buffer)})//.then(buffer => resolve(buffer))
    })
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

class Texter{
  constructor(text,x,y,options){
    this.text = text+''
    this.x = x || 0
    this.y = y || 0
    this.h = options && options.h ? options.h : 16
    this.w = options && options.w ? options.w : 8
  }
  slice(index){
    this.text = index ? this.text.slice(0,index) : textSlice(this.text)
    return this
  }
  centerX(x){
    this.x = textCenter(this.text,x || this.x)
    return this
  }
  centerY(y,base){
    this.y = textCenter(this.text,x || this.x)
    return this
  }
  centerYImg(h,base){
    base = base || this.y
    this.y = base + Math.round((h-this.h)/2)
    return this
  }
  alignVPic(){
    this.y += SPACE.s4
    return this
  }
  static _align(text,mode,x,charWidth){
    switch (mode) {
      case 'left':
        return x
      case 'center':
        return x - Math.round(text.length*charWidth/2)
      case 'right':
        // console.log(text,x - text.length*charWidth);
        return x - text.length*charWidth
      default:
        return x
    }
  }
  alignH(mode,x,w){
    this.x = Texter._align(this.text,mode,x || this.x,w || this.w)
    return this
  }
}

function textSlice(text){
  return text.length > CHARS_LIMIT ? text.slice(0,CHARS_LIMIT) : text
}

function textCenter(text,x){
  const wchar = 8
  return x - Math.round(text.length*wchar/2)
}

function numberToK(number,format,digits){ //Deprecated
  digits = digits || 1
  format = format || 1000
  return (number/format).toFixed(digits)
}

function loadAsset(asset,type){
  if(!asset){return null}
  if(type === 'hero'){
    return jimp.read('./img/heroes/'+ ids.getHero(asset) + '.jpg')
  }else if(type === 'item'){
    return jimp.read('./img/items/'+ ids.getItem(asset) + '.jpg')
  }else if(type === 'font'){
    if(asset === 'open-sans-yellow'){
      return jimp.loadFont(__dirname+'/fonts/open-sans-16-yellow/open-sans-16-yellow.fnt')
    }
  }
}
