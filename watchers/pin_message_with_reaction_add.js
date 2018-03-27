const { Watcher } = require('aghanim')
const util = require('erisjs-utils')

module.exports = new Watcher('','messageReactionAdd',{}, function(msg,emoji,userID){
  if(msg.channel.guild && emoji.name === this.config.emojis.default.pin){
    const member = msg.channel.guild.members.get(userID);
    if(util.member.hasRole(member,this.config.roles.aegis)){
      msg.channel.getMessage(msg.id).then(m => {
        if(!m.pinned){m.pin()}else{m.unpin()}
      })
    }
  }
})
