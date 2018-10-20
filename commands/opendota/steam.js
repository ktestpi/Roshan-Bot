const { Command } = require('aghanim')
const { Markdown } = require('erisjs-utils')
const opendota = require('../../helpers/opendota')
const basic = require('../../helpers/basic')

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
          profile.profile = snap.val().profile;
          profile.user = msg.channel.guild.members.get(profile.account_id);
          func(msg,args,profile,this);
        })
      }else{
        if(!isNaN(profile.account_id)){
          profile.profile.dota = profile.account_id;
          func(msg,config,profile,this);
        }else{
          opendota.getProPlayerDotaID(profile.account_id).then((player) => {
            profile.profile.dota = player.account_id;
            profile.profile.steam = player.steamid;
            func(msg,args,profile,this);
          })
        }
      }
    }
  })

function func(msg,args,profile,bot){
  // console.log('DOTABUFF ID', profile);
  opendota.request('player_steam',profile.profile.dota).then(results => {
    if(!results[0].profile){return};
    const lang = bot.locale.getUserStrings(msg)
    msg.reply({
      embed: {
        title : opendota.titlePlayer(results,bot.locale.get('playerProfile',msg),bot.locale),
        description : bot.locale.replacer(lang.steamProfileDesc,{profile : opendota.util.nameAndNick(results[0].profile), link : Markdown.link(results[0].profile.profileurl,lang.steam), url : results[0].profile.profileurl}),
        thumbnail : {url : results[0].profile.avatarmedium, height : 40, width : 40},
        footer : {text : profile.isDiscordID ? profile.user.username : opendota.util.nameAndNick(results[0].profile), icon_url : profile.isDiscordID ? profile.user.avatarURL : results[0].profile.avatarmedium},
        color : bot.config.color
      }
    })
  }).catch(err => opendota.error(bot,msg,err))
}
