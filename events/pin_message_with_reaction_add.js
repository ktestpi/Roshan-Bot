const { Event } = require('aghanim')
const { Member } = require('erisjs-utils')

module.exports = new Event('aegis_pin_message','messageReactionAdd',{}, function(msg,emoji,userID){
  if(msg.channel.guild && emoji.name === this.config.emojis.default.pin){
    const member = msg.channel.guild.members.get(userID);
    if(Member.hasRole(member,this.config.roles.aegis)){
      msg.channel.getMessage(msg.id).then(m => {
        if(!m.pinned){m.pin()}else{m.unpin()}
      })
    }
  }
})
