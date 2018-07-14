const util = require('erisjs-utils')
const unknown = require('../lang.json').unknown
const basic = require('./basic.js')
const enumMedal = require('../helpers/enums/medals')

const request = (urls,id) => {
  // console.log(urls);
  return util.request.getJSONMulti(urls.map(url => replace(url,'<id>',id)))}
const replace = (text,match,repl) => text.replace(match,repl)

const OPENDOTA_URLS = {
   player : 'https://api.opendota.com/api/players/<id>',
   player_wl : 'https://api.opendota.com/api/players/<id>/wl',
   player_heroes : 'https://api.opendota.com/api/players/<id>/heroes',
   player_totals : 'https://api.opendota.com/api/players/<id>/totals',
   player_matches : 'https://api.opendota.com/api/players/<id>/matches?significant=0',
   player_pros : 'https://api.opendota.com/api/players/<id>/pros',
   player_friends : 'https://api.opendota.com/api/players/<id>/peers?date=30',
   match : 'https://api.opendota.com/api/matches/<id>',
   competitive : 'https://api.opendota.com/api/proMatches/',
   proplayers : 'https://api.opendota.com/api/proPlayers/',
   search_player : 'https://api.opendota.com/api/search?q=<id>&similarity=0.5',
   search_pro : 'https://api.opendota.com/api/proPlayers/'
}

let opendota = {};

opendota.util = require('./opendota-utils.js')
opendota.enum = require('./opendota-enums.js')

opendota.request = function(mode,id){
  const urls = {
    card : [OPENDOTA_URLS.player],
    card_heroes : [OPENDOTA_URLS.player,OPENDOTA_URLS.player_heroes],
    player : [OPENDOTA_URLS.player,OPENDOTA_URLS.player_wl,OPENDOTA_URLS.player_heroes,OPENDOTA_URLS.player_totals],
    player_matches : [OPENDOTA_URLS.player,OPENDOTA_URLS.player_matches],
    player_lastmatch : [OPENDOTA_URLS.player_matches],
    player_friends : [OPENDOTA_URLS.player,OPENDOTA_URLS.player_friends],
    player_pros : [OPENDOTA_URLS.player,OPENDOTA_URLS.player_pros],
    player_steam : [OPENDOTA_URLS.player],
    match : [OPENDOTA_URLS.match],
    competitive : [OPENDOTA_URLS.competitive],
    search_player : [OPENDOTA_URLS.search_player],
    search_pro : [OPENDOTA_URLS.search_pro]
  }
  if(urls[mode]){
    return request(urls[mode],id)
  }
}

opendota.titlePlayer = function(results,title,replace){
  // console.log(replace);console.log('*********************');
  const medal = enumMedal({rank : results[0].rank_tier, leaderboard : results[0].leaderboard_rank})
  console.log(medal);
  return typeof results[0].profile.loccountrycode == 'string' ? replace.do(title,{user : opendota.util.nameAndNick(results[0].profile), flag : results[0].profile.loccountrycode.toLowerCase(), medal : replace.do(medal.emoji)},true)
  : util.string.replace(title,{'<user>' : opendota.util.nameAndNick(results[0].profile), ':flag_<flag>:' : ' ', '<medal>' : replace.do(medal.emoji)},false)
  // return typeof results[0].profile.loccountrycode == 'string' ? replace.do(title,{user : opendota.util.nameAndNick(results[0].profile), flag : results[0].profile.loccountrycode.toLowerCase(), medal : opendota.util.getMedal(results[0],'emoji',replace)},true)
  // : util.string.replace(title,{'<user>' : opendota.util.nameAndNick(results[0].profile), ':flag_<flag>:' : ' ', '<medal>' : opendota.util.getMedal(results[0],'emoji',replace)},false)
}

opendota.odcall = function(bot,msg,args,callback){
  var profile = basic.getAccountID(msg,args,bot);
  if(profile.isCached){
    // console.log('Launch form cached',profile);
    callback(msg,args,profile);
  }else{
    if(profile.isDiscordID){
      bot.db.child('profiles/' + profile.account_id).once('value').then((snap) => {
        if(!snap.exists()){basic.needRegister(msg,msg.author.id);return};
        profile.id = snap.val().profile;
        callback(msg,args,profile);
      })
    }else{
      if(!isNaN(profile.account_id)){
        profile.profile.dota = profile.account_id;
        callback(msg,args,profile);
      }else{
        basic.getProPlayerDotaID(profile.account_id).then((player) => {
          // console.log('PLAYER',player);
          profile.profile.dota = player.account_id;
          profile.profile.steam = player.steamid;
          callback(msg,args,profile);
        })
      }
    }
  }
}

opendota.getPlayersDotaName = function(query){ //Promise
  return new Promise((resolve, reject) => {
    opendota.request('search_player',query).then((results) => {
      let players = results[0];
      if(players){resolve(players)}else{reject("getPlayersDotaName not found")};
    }).catch(err => console.log(err))
  })
}

opendota.getProPlayersDotaName = function(query){ //Promise
  return new Promise((resolve, reject) => {
    opendota.request('search_pro',query).then((results) => {
      let pros = results[0].filter(player => player.name.toLowerCase().match(new RegExp(query.toLowerCase())))
      if(pros){resolve(pros)}else{reject("getProPlayersDotaName not found")};
    }).catch(err => console.log(err))
  })
}

opendota.error = function(bot,msg,message,error){
  bot.logger.add('oderror',`Ocurrió un error con Opendota:\n<< ${error} >>\nUser: ${msg.author.username} (${msg.author.id})`,true)
  msg.author.getDMChannel().then(channel => channel.createMessage(message))
}

opendota.urls = OPENDOTA_URLS

opendota.urlReplace = replace

module.exports = opendota