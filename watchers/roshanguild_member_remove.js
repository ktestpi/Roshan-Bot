const { Watcher } = require('aghanim')
const util = require('erisjs-utils')
// const lang = require('../lang.json')

module.exports = new Watcher('','guildMemberRemove',{}, function(guild,member){
  if(guild.id !== this.config.guildID){return};
  this.logger.add('memberout',member.username,true);
})
