const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('id',{
  category : 'Cuenta', help : 'Enlaces a Dotabuff, Steam, Twitch y Twitter', args : '[mención]'},
  function(msg, args, command){
    // let self = this
    const profile = basic.getAccountID(msg,args,this);
    if(profile.isCached){
      func(msg,args,profile,this);
    }else{
      if(profile.isDiscordID){
        this.config.db.child('profiles/' + profile.account_id).once('value').then((snap) => {
          if(!snap.exists()){return basic.needRegister(msg,profile.account_id,config)};
          profile.id = Object.assign(snap.profile,{});
          func(msg,args,profile,this);
        })
      }
    }
  })

function func(msg,args,profile,bot){
  let user = msg.channel.type === 0 ? msg.channel.guild.members.get(profile.account_id) : msg.author
  msg.reply({
    embed : {
      title : lang.userInfoTitle.replaceKey({username : user.username}),
      fields : [
        {name : lang.userInfoIDTitle,
        value : basic.socialLinks(profile.profile,'vertical',bot.config.links.profile),//socialLinks(config.links.profile,snap.val().profile,'verticalIDMinL'),
        inline : true}],
      thumbnail : {url : user.avatarURL, height : 40, width : 40},
      color : bot.config.color
    }
  })
}
