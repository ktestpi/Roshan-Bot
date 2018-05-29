const { Command } = require('aghanim')
const util = require('erisjs-utils')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('steam',{
  category : 'Dota 2', help : 'Url de steam de un jugador', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    let self = this
    // console.log('CACHE',this.cache);
    // console.log('SELF',self);
    const profile = basic.getAccountID(msg,args,this);
    // console.log('PROFILE',profile);
    if(profile.isCached){
      // console.log('Launch form cached');
      func(msg,args,profile,this);
    }else{
      if(profile.isDiscordID){
        this.db.child('profiles/' + profile.account_id).once('value').then((snap) => {
          if(!snap.exists()){basic.needRegister(msg,id,this.config.emojis.default.error);return};
          profile.id = snap.val().profile;
          profile.user = msg.channel.guild.members.get(profile.account_id);
          func(msg,args,profile,this);
        })
      }else{
        if(!isNaN(profile.account_id)){
          profile.id.dota = profile.account_id;
          func(msg,config,profile,this);
        }else{
          opendota.getProPlayerDotaID(profile.account_id).then((player) => {
            profile.id.dota = player.account_id;
            profile.id.steam = player.steamid;
            func(msg,args,profile,this);
          })
        }
      }
    }
  })

function func(msg,args,profile,bot){
  console.log('DOTABUFF ID', profile);
  opendota.request('player_steam',profile.id.dota).then(results => {
    if(!results[0].profile){return};
    msg.reply({
      embed: {
        title : opendota.titlePlayer(results,lang.playerProfile,bot.replace),
        description : bot.replace.do(lang.steamProfileDesc, {profile : opendota.util.nameAndNick(results[0].profile), link : util.md.link(results[0].profile.profileurl,lang.steam), url : results[0].profile.profileurl},true),
        thumbnail : {url : results[0].profile.avatarmedium, height : 40, width : 40},
        footer : {text : profile.isDiscordID ? profile.user.username : opendota.util.nameAndNick(results[0].profile), icon_url : profile.isDiscordID ? profile.user.avatarURL : results[0].profile.avatarmedium},
        color : bot.config.color
      }
    })
  }).catch(e => {opendota.error(bot,msg,lang.errorOpendotaRequest,e)})
}
