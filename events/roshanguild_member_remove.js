const { Event } = require('aghanim')
// const lang = require('../lang.json')

module.exports = new Event('','guildMemberRemove',{}, function(guild,member){
  if(guild.id !== this.config.guildID){return};
  // this.logger.add('memberout',member.username,true);
  this.discordLog.controlMessage('memberout',`**${member.username}**`)
})
