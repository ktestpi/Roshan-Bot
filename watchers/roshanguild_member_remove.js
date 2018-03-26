const { Watcher } = require('drow')
const util = require('erisjs-utils')
// const lang = require('../lang.json')

module.exports = new Watcher('','guildMemberAdd',{}, function(guild,member){
  if(guild.id !== this.config.guildID){return};
  this.logger.add('memberout',member.username,true);
})
