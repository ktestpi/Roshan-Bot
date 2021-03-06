const util = require('erisjs-utils')
const dotasteam = require('./dotasteam.js')
// const proplayersURL = require('./opendota.js').urls['proplayers']
let self = module.exports
// color = "#2BC6CC"

module.exports.parseText = function(text,mode){
  if(typeof text != 'string'){return 'Unknown'}
  var newText = text;
  if(mode == 'nf'){
    newText = text.replace(new RegExp('`','g'),'\'')
  }
  return newText
}

module.exports.replaceMessageFields = function(message,converted,replace,func){
  if(typeof message === 'object'){
    let converted = Array.isArray(message) ? [] : {}
    for (var prop in message) {
      if(Array.isArray(message)){prop = parseInt(prop)}
      if(typeof message[prop] === 'object'){converted[prop] = module.exports.replaceMessageFields(message[prop],converted,replace,func)}
      else if(typeof message[prop] === 'string'){converted[prop] = func ? func(replace.do(message[prop])) : replace.do(message[prop])}
      else{converted[prop] = message[prop]}
    }
    return converted //Object.assingn({{},converted)
  }else if(typeof message === 'string'){
    return replace.do(message)
  }
}
module.exports.replaceColor = function(color,colors){
  if(typeof color === 'string'){
    if(color.startsWith('#')){return util.Color.convert(color,'hex-int')}
    else if(colors[color]){
      if(typeof colors[color] === 'string' && colors[color].startsWith('#')){return util.Color.convert(color,'hex-int')}
      else{return colors[color]}
    }
  }
}


module.exports.parseProfileURL = function(url,mode){
  var data = url;
  if(mode == 'dota'){
    if(url.startsWith('https://www.dotabuff.com/players/')){
      data = url.match(new RegExp('https://www.dotabuff.com/players/(\\w*)'))[1]
    }else if(url.startsWith('https://es.dotabuff.com/players/')){
      data = url.match(new RegExp('https://es.dotabuff.com/players/(\\w*)'))[1]
    }
    let dotabuff = data.match(new RegExp('(\\d*)'))[1];
    if(dotabuff.length != data.length){data = false};
  }else if(mode == 'steam'){
    if(url.startsWith('http://steamcommunity.com/profiles/')){
      data = url.match(new RegExp('http://steamcommunity.com/profiles/([a-zA-Z0-9_\-]+)'))[1] //http://steamcommunity.com/profiles/(\\w*)
    }else if(url.startsWith('http://steamcommunity.com/id/')){
      data = url.match(new RegExp('http://steamcommunity.com/id/([a-zA-Z0-9_\-]+)'))[1]
    }
  }else if(mode == 'twitch'){
    if(url.startsWith('https://go.twitch.tv/')){
      data = url.match(new RegExp('https://go.twitch.tv/([a-zA-Z0-9_\-]+)'))[1]
    }
  }else if(mode == 'twitter'){
    if(url.startsWith('https://twitter.com/')){
      data = url.match(new RegExp('https://twitter.com/([a-zA-Z0-9_\-]+)'))[1]
    }
  }
  return data
}

module.exports.durationTime = function(time){
  time = parseInt(time)
  var m = Math.floor(time/60)
  var s = time%60
  return util.Number.zerofication(m) + ':' + util.Number.zerofication(s)
}

module.exports.sendImageStructure = function(msg,query,links,cmd){
  if(!links[query]){return module.exports.wrongCmd(msg,links,cmd)} // TODO wrongCmd
  const match = links[query]
  if(typeof match === 'object'){
    util.Message.sendImage(match.file).then(buffer => {
      msg.reply(match.msg,{file : buffer, name : match.name})
    })
  }else if(typeof query === 'string'){
    msg.reply(match)
  }
  // if(typeof pics[query] == 'object'){
  //   util.msg.sendImage_(url).then(buffer => {
  //     msg.reply(util.string.replace(pics[query].msg, {author : msg.author.username},true),{file : buffer, name : pics[query].name});
  //   })
  //   util.msg.sendImage([pics[query].file],[],{msg : msg, config : config, pics : pics, query : query},function(results,container){
  //
  //   })
  // }else{
  //   msg.reply(util.string.replace(pics[query], {author : msg.author.username},true));
  // }
}

module.exports.secondsTohms = function(seconds){
  let hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${util.Number.zerofication(hours)}:${util.Number.zerofication(minutes)}:${util.Number.zerofication(seconds)}`
}

module.exports.switchesEmojiStatus = function(swit){
  return swit ? '✅' : '❌'
}

// module.exports.wrongCmd = function(msg,list,prefix){
//   const options = Object.keys(list).sort()
//   msg.author.getDMChannel().then(channel => channel.createMessage(`:x: **Opciones disponibles** para \`${prefix}\`\n\n|${options.filter(o => o).map(o => `\`${o}\``).join(', ')}|`))
// }

// const initialServerConfig = {
//   notifications : {channel : "", enable : true},
//   feeds : {channel : "", enable : true, subs : ""},
//   lang : ''
// }

// module.exports.resetServerConfig = function(bot,guild){
//   let reset = initialServerConfig;
//   const defaultChannel = util.Guild.getDefaultChannel(guild,bot,true).id
//   reset.notifications.channel = defaultChannel;
//   reset.feeds.channel = defaultChannel;
//   reset.lang = this.locale.defaultLanguage
//   return bot.cache.servers.save(guild.id,reset)
// }

// module.exports.newAccount = function(data){
//   return {
//     // medal : data.medal || false,
//     // leaderboard : data.leaderboard || false,
//     lang : 'en',
//     card : {
//       bg : '0',
//       pos : 'all', //1-5,sup,core,off,mid,carry,all
//       heroes : ''
//     },
//     profile : data.profile,
//   }
// }

// module.exports.accountSchema = function(){
//   return {
//     lang : '',
//     card : {
//       bg : '',
//       heroes : '',
//       pos : ''
//     },
//     profile : {
//       dota : '',
//       steam : '',
//       twitter : '',
//       twitch : ''
//     }
//   }
// }

// module.exports.updateAccountSchema = function(data,strict){
//   const schema = module.exports.accountSchema()
//   let result
//   if(strict){
//     result = module.exports.mergeObject(schema,data)
//   }else{
//     result = Object.assign({},schema,data)
//   }
//   return result
// }

// module.exports.mergeObject = function(base,merge){
//     for (var el in merge) {
//       if(typeof merge[el] === 'object'){module.exports.mergeObject(base[el],merge[el])}
//       else{base[el] = merge[el]}
//     }
//     // delete base['_id']
//     return Object.assign({},base)
// }

// module.exports.sortTourneys = (a,b) => {
//   if(a.start && b.start){
//     return b.start - a.start
//   }else if(a.start){
//     return -1
//   }else if(b.start){
//     return 1
//   }else{
//     if(a.until && b.until){
//       return b.until - a.until
//     }else if(a.until){
//       return -1
//     }else if(b.until){
//       return 1
//     }else{
//       return module.exports.sortBy('alpha','d','_d')(a,b);
//     }
//   }
// }
// module.exports.sortBy = (by = 'alpha', mode = 'd',param='_id') => {
//   switch (by) {
//     case 'alpha':
//       return sortAlpha(v => v[param].toLowerCase(),mode)
//     case 'number':
//       return sortAlpha(v => parseInt(v[param]),mode)
//     default:
//   }
// }

function sortAlpha(callback,mode){
  mode = mode === 'd' ? 'd' : 'a'
  return function(a,b){
    a = callback(a)
    b = callback(b)
    if(mode === 'a'){
      if(a < b){return -1}else if(a > b){return 1}else{return 0}
    }else{
      if(a < b){return 1}else if(a > b){return -1}else{return 0}
    }
  }
}

module.exports = self
