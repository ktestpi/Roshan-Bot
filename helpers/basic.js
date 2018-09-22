const util = require('erisjs-utils')
const lang = require('../lang.json')
const dotasteam = require('./dotasteam.js')
// const proplayersURL = require('./opendota.js').urls['proplayers']
let self = module.exports
// color = "#2BC6CC"
module.exports.getAccountID = function(msg,args,bot){
  // console.log(args);
  var base = {account_id : "", isCached : false, isDiscordID : true};
  if(msg.mentions.length > 0){
    base.account_id = msg.mentions[0].id;
  }else if(args.length > 1){
    base.account_id = args[1];
    base.isDiscordID = false;
  }else{
    base.account_id = msg.author.id;
  };
  const cachePlayerID = bot.cache.profiles.get(base.account_id);
  // console.log('CACHEPLAYERID',cachePlayerID,bot.cache.profiles.getid(profile.account_id));
  // console.log(profile);
  let profile
  if(cachePlayerID){
    base.isCached = true; base.isDiscordID = false;
    // profile = Object.assign({},base,bot.cache.profiles.data(base.account_id))
    profile = Object.assign({},base,cachePlayerID)
  }else{
    profile = Object.assign({},base,module.exports.accountSchema())
  }
  return profile
}

module.exports.parseText = function(text,mode){
  if(typeof text != 'string'){return lang.unknown}
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
// module.exports.odcall = function(bot,msg,args,callback){
//   var profile = self.getAccountID(msg,args,bot);
//   if(profile.isCached){
//     console.log('Launch form cached');
//     callback(msg,args,profile);
//   }else{
//     if(profile.isDiscordID){
//       bot.db.child('profiles/' + profile.account_id).once('value').then((snap) => {
//         if(!snap.exists()){self.needRegister(msg,msg.author.id);return};
//         profile.id = snap.val().profile;
//         callback(msg,args,profile);
//       })
//     }else{
//       if(!isNaN(profile.account_id)){
//         profile.id.dotabuff = profile.account_id;
//         callback(msg,args,profile);
//       }else{
//         self.getProPlayerDotaID(profile.account_id).then((player) => {
//           profile.id.dotabuff = player.account_id;
//           profile.id.steam = player.steamid;
//           callback(msg,args,profile);
//         })
//       }
//     }
//   }
// }

module.exports.needRegister = function(msg,id,reactionError){
  msg.addReaction(reactionError);
  if(msg.author.id != id){return};
  const message = ':x: No puedes usar ese comando porque **no estás registrad@**. Para ello, **usa `r!register` y sigue las instrucciones**. ¡Muchas gracias!';
  if(msg.channel.type == 0){
    msg.author.getDMChannel().then((channel) => {
      channel.createMessage(message);
    })
  }else{
    msg.reply(message);
  }
}

module.exports.getProPlayerDotaID = function(name){ //Promise
  return new Promise((resolve, reject) => {
    var urls =  ['https://api.opendota.com/api/proPlayers/'];
    util.Request.getJSONMulti(urls).then((results) => {
      let pro = results[0].find(player => player.name.toLowerCase() === name.toLowerCase())
      if(pro){resolve(pro)}else{reject("getProPlayerDotaID not found")};
    }).catch(err => console.log(err))
  })
}

module.exports.socialLinks = function(links,mode,urls){
  // console.log(links);
  const profile = Object.keys(links).filter(link => links[link]).map(link => ({type : link, link : module.exports.createProfileLink(links[link],link,urls)}))
  if(mode == 'inline'){
    return profile.map(link => util.Markdown.link(link.link,util.String.capitalize(link.type))).join(' / ')
  }else if(mode == 'vertical'){
    return profile.map(link => util.Markdown.link(link.link,util.String.capitalize(link.type),'embed+link')).join('\n')
  }
}

module.exports.createProfileLink = function(content,mode,urls){
    if(mode === 'dota'){
      return dotasteam.dota.idToUrl(content,'dotabuff')
    }else if(mode === 'steam'){
      return content.startsWith('http') ? content : dotasteam.steam.idToUrl(content,mode)
      // return content
    }else if(mode === 'twitch'){
      return urls.twitch + content
    }else if(mode === 'twitter'){
      return urls.twitter + content
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
      console.log('hello');
      data = url.match(new RegExp('http://steamcommunity.com/profiles/([a-zA-Z0-9_\-]+)'))[1] //http://steamcommunity.com/profiles/(\\w*)
    }else if(url.startsWith('http://steamcommunity.com/id/')){
      console.log('hi');
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

module.exports.dotabuffError = function(msg){
  msg.reply(':x: **Tu DotabuffID tiene algún error.** Comprueba que lo has escrito correctamente y en el formato adecuado')
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

module.exports.wrongCmd = function(msg,list,prefix){
  const options = Object.keys(list).sort()
  msg.author.getDMChannel().then(channel => channel.createMessage(`:x: **Opciones disponibles** para \`${prefix}\`\n\n|${options.filter(o => o).map(o => `\`${o}\``).join(', ')}|`))
}

const initialServerConfig = {
  notifications : {channel : "", enable : true},
  feeds : {channel : "", enable : true, subs : ""}
}

module.exports.resetServerConfig = function(bot,guild){
  let reset = initialServerConfig;
  const defaultChannel = util.Guild.getDefaultChannel(guild,bot,true).id
  reset.notifications.channel = defaultChannel;
  reset.feeds.channel = defaultChannel;
  return bot.cache.servers.save(guild.id,reset)
}

module.exports.newAccount = function(data){
  return {
    // medal : data.medal || false,
    // leaderboard : data.leaderboard || false,
    card : {
      bg : '0',
      pos : 'all', //1-5,sup,core,off,mid,carry,all
      heroes : ''
    },
    profile : data.profile,
  }
}

module.exports.accountSchema = function(){
  return {
    card : {
      bg : '',
      heroes : '',
      pos : ''
    },
    profile : {
      dota : '',
      steam : '',
      twitter : '',
      twitch : ''
    }
  }
}

module.exports.updateAccountSchema = function(data,strict){
  const schema = module.exports.accountSchema()
  let result
  if(strict){
    result = module.exports.mergeObject(schema,data)
  }else{
    result = Object.assign({},schema,data)
  }
  return result
}

module.exports.mergeObject = function(base,merge){
    for (var el in merge) {
      if(typeof merge[el] === 'object'){module.exports.mergeObject(base[el],merge[el])}
      else{base[el] = merge[el]}
    }
    // delete base['_id']
    return Object.assign({},base)
}

module.exports.sortTourneys = (a,b) => {
  if(a.start && b.start){
    return b.start - a.start
  }else if(a.start){
    return -1
  }else if(b.start){
    return 1
  }else{
    if(a.until && b.until){
      return b.until - a.until
    }else if(a.until){
      return -1
    }else if(b.until){
      return 1
    }else{
      return module.exports.sortBy('alpha','d','_d')(a,b);
    }
  }
}
module.exports.sortBy = (by = 'alpha', mode = 'd',param='_id') => {
  switch (by) {
    case 'alpha':
      return sortAlpha(v => v[param].toLowerCase(),mode)
    case 'number':
      return sortAlpha(v => parseInt(v[param]),mode)
    default:
  }
}

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
