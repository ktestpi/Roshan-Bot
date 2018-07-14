const jimp = require('jimp')
const util = require('erisjs-utils')
const basic = require('../basic')
const opendota = require('../opendota')
const getFromEnum = require('../enums')
const Canvas = require('./canvas')

const SIZE_IMAGE = { w : 700 , h : 322}
const ITEM_WIDTH = 33
const ITEM_HEIGHT = 24
const HERO_WIDTH = 50
const HERO_HEIGHT = 24
const SPACE = {"s4" : 4, "s6" : 6}
const CHARS_LIMIT_NAME = 15
const CHARS_LIMIT = 15
const UNKNOWN = 'Desconocid@'

module.exports.match = function(data_info){
  const POSITION = {
    TABLE : {Y : 40 , X : 12},
    SPACE_TEAMS_Y : 8,
    ITEMS_X : 460,
    STATS : [0,140,160,180,210,250,310,390],
    MATCH_ID_Y : 292
  }
  // console.log('HELLO');
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
            let texter = new Texter(data[i][j]+'',sx,y).alignVPic()
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
    }).catch(err => {})
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

module.exports.card = function(info){
  // var jimps = [new jimp(400,180,0x000000FF)]
  // var jimps = [new jimp(SIZE_IMAGE.w, SIZE_IMAGE.h)]
  const [player,card] = info
  var jimps = [Promise.all([loadAsset(card.bg,'card_bg'),jimp.read('./img/roshan_card.png')])]
  // console.log(player);
  jimps.push(Promise.all([jimp.loadFont(jimp.FONT_SANS_32_WHITE),jimp.loadFont(jimp.FONT_SANS_16_WHITE)]))
  // jimps.push(jimp.loadFont(__dirname+'/fonts/open-sans-16-yellow/open-sans-16-yellow.fnt'))
  jimps.push(Promise.all([jimp.read('./img/dota2_16x16.png'),jimp.read('./img/steam_16x16.png')]))
  jimps.push(jimp.read(player.profile.avatarfull))
  // player.rank_tier = 80
  // player.leaderboard_rank = 10
  jimps.push(loadAsset({rank : player.rank_tier, leaderboard : player.leaderboard_rank},'medal'))
  if(card.heroes.split(',').length > 0){
    const heroes = []
    card.heroes.split(',').forEach(hero => {
      heroes.push(loadAsset(hero,'minihero'))
    })
    jimps.push(Promise.all(heroes))
  }
  // console.log('JIMPS',jimps);
  // jimps.push(Promise.all([new jimp(160,16,0xFF0000FF),new jimp(153,16,0xFF0000FF)]))
  return new Promise((resolve,reject) => {
    Promise.all(jimps).then(data => {
      let canvas = new Canvas(data[0][0],{w16 : data[1][0], w8 : data[1][1]})
      let template = canvas.paint('template',data[0][1]).add()
      let avatar = canvas.paint('avatar',data[3].resize(jimp.AUTO,96))
      let medal = canvas.paint('medal',data[4].resize(jimp.AUTO,64)).place(avatar,'cxby',{y : -16})
      let leaderboard
      // let group_avatar = [avatar]
      let group_avatar = [avatar,medal]
      if(player.leaderboard_rank){
        leaderboard = canvas.write('leaderboard',"#10001" || '#' + player.leaderboard_rank,'w8').place(medal,'rx',{x : 5}).place(avatar,'by',{y : 0});
        group_avatar.push(leaderboard)
      }
      group_avatar = canvas.group('group_avatar',group_avatar).set(canvas,'lxty',{x : 20 , y : 20})
      let namePlayer = canvas.write('namePlayer',textSlice(player.profile.personaname),'w16')
      let positionPlayer = canvas.write('positionPlayer',getFromEnum.player_positions(card.pos),'w8').place(namePlayer,'by',{y : 5})
      let hero1 = canvas.paint('hero1',data[5][0].resize(jimp.AUTO,28)).place(positionPlayer,'by',{ y : 8})
      let hero2 = canvas.paint('hero2',data[5][1].resize(jimp.AUTO,28)).place(hero1,'rxty',{ x : 5, y : 0})
      let hero3 = canvas.paint('hero3',data[5][2].resize(jimp.AUTO,28)).place(hero2,'rxty',{ x : 5, y : 0})
      canvas.group('playerInfo',[namePlayer,positionPlayer,hero1,hero2,hero3]).set(avatar,'rxty',{x : 14, y : 0})

      // canvas.group([hero1,hero2,hero3]).set(playerInfo,'cxby',{y : 10})
      let dotaAvatar = canvas.paint('dotaAvatar',data[2][0].resize(jimp.AUTO,16))
      let dotaID = canvas.write('dotaID',player.profile.account_id.toString(),'w8').place(dotaAvatar,'rx', {x : 4})
      let steamAvatar = canvas.paint('steamAvatar',data[2][1].resize(jimp.AUTO,16)).place(dotaID,'rx',{ x : 4})
      let steamID = canvas.write('steamID',player.profile.steamid,'w8').place(steamAvatar,'rx', {x : 4})
      // canvas.group('playerID',[dotaAvatar,dotaID,steamAvatar,steamID]).set(canvas,'gxrgyb',{x : 10, y : 15})
      canvas.group('playerID',[dotaAvatar,dotaID,steamAvatar,steamID]).place(canvas,'gxr',{x : 10}).set(canvas,'gyb',{y : 12})

      // let medal = canvas.paint('medal',data[4].resize(jimp.AUTO,48)).set(canvas,'gyblx',{x : 15, y : 0})
      canvas.create('png').then(buff => resolve(buff)).catch(err => reject(err))
      // let avatar = canvas.paint('avatar',data[3].resize(jimp.AUTO,96),{x : 20, y : 20}).add()
      // // let positionPlayer = canvas.write('positionPlayer',getFromEnum.player_positions(card.pos),8,'w8').place(namePlayer,'by',{y : 8})
      //
      // // console.log(player.profile);
      // let playerInfo = canvas.group([namePlayer,positionPlayer]).align('cx').set(avatar,'rxty',{x : 20, y : 6})
      // // data[0].print(data[1][0],0,0,'DESVELAO^^',50)
      // let medal = canvas.paint('medal',data[4].resize(jimp.AUTO,32)).set(avatar,'cxby',{ y : -16})
      //
      //


      // canvas.create().then(buff => resolve(buff))
    }).catch(err => {
      reject(err)
    })
  })
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
    return jimp.read('./img/heroes/'+ getFromEnum.heroesNameID(asset) + '.jpg')
  }else if(type === 'item'){
    return jimp.read('./img/items/'+ getFromEnum.items(asset) + '.jpg')
  }else if(type === 'minihero'){
    return jimp.read('./img/miniheroes/'+ getFromEnum.heroesNameID(asset) + '.png')
  }else if(type === 'font'){
    if(asset === 'open-sans-yellow'){
      return jimp.loadFont(__dirname+'/fonts/open-sans-16-yellow/open-sans-16-yellow.fnt')
    }
  }else if(type === 'medal'){
    return jimp.read('./img/medals/'+ getFromEnum.medals(asset).compose + '.png')
  }else if(type === 'card_bg'){
    // console.log('CARDBG',asset,getFromEnum.card_bg(asset));
    return jimp.read('./img/cards/'+ getFromEnum.card_bg(asset) + '.jpg')
  }
}

function textSize(size){
  return size*0.5
}

function textWidth(text,font){
  const chars = text.split('');
  let size = 0
  chars.forEach(c => {
    size += font.chars[c] ? font.chars[c].xadvance : 0
  })
  return size
}

// class SimpleElement{
//   constructor(x,y,w,h){
//     this.x = x || 0
//     this.y = y || 0
//     this.w = w || 0
//     this.h = h || 0
//   }
//   place(el,mode,options){
//     el = el || this.base
//     // this.x = el.x ; this.y = el.y
//     if(mode.includes('elx')){
//       this.x = el.x
//     }
//     if(mode.includes('ely')){
//       this.y = el.y
//     }
//     if(mode.includes('lx')){
//       this.x = el.x + options.x
//     }else if(mode.includes('rx')){
//       this.x = el.x + el.w + options.x
//     }else if(mode.includes('cx')){
//       this.x = el.x + (el.w - this.w)/2
//     }else if(mode.includes('gxl')){
//       this.x = el.x
//     }else if(mode.includes('gxr')){
//       this.x = el.x + el.w - this.w - options.x
//     }else if(mode.includes('ax')){
//       this.x = options.x
//     }
//     if(mode.includes('ty')){
//       this.y = el.y + options.y
//     }else if(mode.includes('by')){
//       this.y = el.y + el.h + options.y
//     }else if(mode.includes('cy')){
//       this.y = el.y + (el.h - this.h)/2
//     }else if(mode.includes('gyt')){
//       this.y = el.y
//     }else if(mode.includes('gyb')){
//       this.y = el.y + el.h - this.h - options.y
//     }else if(mode.includes('ay')){
//       this.y = options.y
//     }
//     return this
//     // return this.add()
//   }
//   set(el,mode,options){
//     this.place(el,mode,options)
//     return this.add()
//   }
//   add(){
//     this.base.add(this)
//     return this
//   }
//   move(x,y,dx,dy){
//     x = x || 0; y = y || 0
//     dx = dx || 0; dy = dy || 0
//     this.x = x ? x : this.x + dx
//     this.y = y ? y : this.y + dy
//     return this
//   }
// }
//
// class Element extends SimpleElement{
//   constructor(name,data,base,options){
//     super()
//     options = options || {}
//     this.name = name
//     this.type = data && data.bitmap && data.bitmap.width ? 'image' : 'text'
//     this.data = data || null
//     this.x = options.x || 0
//     this.y = options.y || 0
//     this.base = base
//     this.w = this.type === 'image' ? data.bitmap.width :  textWidth(options.text,options.font)
//     this.h = this.type === 'image' ? data.bitmap.height : options.font.info.size
//     if(this.type === 'text'){this.text = options.text; this.font = options.font}
//   }
//   log(){
//     console.log('Element:',this.name,`(${this.type})`);
//     console.log('X/Y:',this.x,this.y);
//     console.log('W/H:',this.w,this.h);
//     return this
//   }
// }
//
// class Canvas{
//   constructor(base,fonts){
//     this.base = base
//     this.fonts = fonts
//     this.x = 0
//     this.y = 0
//     this.w = this.base.bitmap.width
//     this.h = this.base.bitmap.height
//     this.elements = []
//   }
//   new(name,data,options){
//     let element = new Element(name,data,this,options)
//     return element
//   }
//   write(name,text,size,font){
//     if(typeof font === 'string' && this.fonts[font]){font = this.fonts[font]}
//     return this.new(name,null,{textSize : size, text, font})
//   }
//   paint(name,img,options){
//     return this.new(name,img,options)
//   }
//   add(el){
//     this.elements.push(el)
//   }
//   group(elements){
//     return new Group(elements,this)
//   }
//   ref(x,y,w,h){
//     return new SimpleElement(x,y,w,h)
//   }
//   create(){
//     this.elements.forEach(el => {
//       if(el.type === 'image'){
//         this.base.composite(el.data,el.x,el.y)
//       }else{
//         this.base.print(el.font,el.x,el.y,el.text)
//       }
//     })
//     return new Promise((resolve,reject) => {
//       // this.base.getBuffer(jimp.MIME_JPEG,function(err,buffer){resolve(buffer)})
//       this.base.getBuffer(jimp.MIME_PNG,function(err,buffer){resolve(buffer)})
//     })
//     log(){
//       console.log(`-------- Canvas --------`);
//       console.log('X/Y: ',this.x,this.y);
//       console.log('W/H: ',this.w,this.h);
//     }
//     // this.elements[el.name] = el
//     // if(el.type === 'image'){
//     //   this.base.composite(el,el.x,el.y)
//     // }else{
//     //   this.base.print(this.fonts[font],el.x,el.y,el.text)
//     // }
//   }
// }
//
// function startFromNull(value,start){return value === null ? start : value}
//
// class Group extends SimpleElement{
//   constructor(elements,base){
//     super()
//     this.elements = elements
//     this.base = base
//     let min = {x : null, y : null}
//     let max = {x : null, y : null}
//     elements.forEach(el => {
//       // el.log()
//       min.x = startFromNull(min.x,el.x)
//       min.y = startFromNull(min.y,el.y)
//       max.x = startFromNull(max.x,el.x+el.w)
//       max.y = startFromNull(max.y,el.y+el.y)
//       if(el.x < min.x){min.x = el.x}
//       if(el.x + el.w > max.x){max.x = el.x + el.w}
//       if(el.y < min.y){min.y = el.y}
//       if(el.y + el.h > max.y){max.y = el.y + el.h}
//     })
//     this.x = min.x
//     this.y = min.y
//     this.w = max.x - min.x
//     this.h = max.y - min.y
//   }
//   place(el,mode,options){
//     const { x , y } = super.place(el,mode,options)
//     this.elements.forEach(el => {
//       el.move(0,0,x,y)
//     })
//     this.move(0,0,x,y)
//     return this
//   }
//   add(){
//     this.elements.forEach(el => {
//       this.base.add(el)
//     })
//     return this
//   }
//   align(mode){
//     if(mode === 'cx'){
//       const cx = this.x + this.w/2
//       this.elements.forEach(el => {
//         el.move(cx-el.w/2,0)
//       })
//     }else if(mode === 'cy'){
//       const cy = this.y + this.h/2
//       this.elements.forEach(el => {
//         el.move(0,cy-el.w/2)
//       })
//     }
//     return this
//   }
//   log(){
//     console.log(`-------- Group Elements: ${this.elements.length}  --------`);
//     console.log('X/Y: ',this.x,this.y);
//     console.log('W/H: ',this.w,this.h);
//     console.log('-------------------------------------');
//     this.elements.forEach(el => {
//       el.log()
//       console.log('-------------------------------------');
//     })
//     console.log('-------------------------------------');
//     return this
//   }
// }
