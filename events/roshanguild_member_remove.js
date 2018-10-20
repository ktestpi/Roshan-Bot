const { Event } = require('aghanim')

module.exports = new Event('memberout_dev_server','guildMemberRemove',{}, function(guild,member){
  if(guild.id !== this.config.guildID){return};
  // this.logger.add('memberout',member.username,true);
  this.discordLog.controlMessage('memberout',`**${member.username}**`)
})
