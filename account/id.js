const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('id',{
  category : 'Cuenta', help : 'Enlaces a Dotabuff, Steam, Twitch y Twitter', args : '[mención]'},
  function(msg, args, command){
    let self = this
    const profile = basic.getAccountID(msg,args,self);
    if(profile.isCached){
      func(msg,args,profile,self);
    }else{
      if(profile.isDiscordID){
        self.config.db.child('profiles/' + profile.account_id).once('value').then((snap) => {
          if(!snap.exists()){basic.needRegister(msg,profile.account_id,config);return};
          profile.id = Object.assign(snap.profile,{});
          func(msg,args,profile,self);
        })
      }
    }
  })

function func(msg,args,profile,bot){
  let user = msg.channel.type === 0 ? msg.channel.guild.members.get(profile.account_id) : msg.author
  msg.reply({
    embed : {
      title : bot.replace.do(lang.userInfoTitle,{username : user.username},true),
      fields : [
        {name : lang.userInfoIDTitle,
        value : basic.socialLinks(profile.profile,'vertical',bot.config.links.profile),//socialLinks(config.links.profile,snap.val().profile,'verticalIDMinL'),
        inline : true}],
      thumbnail : {url : user.avatarURL, height : 40, width : 40},
      color : bot.config.color
    }
  })
}
