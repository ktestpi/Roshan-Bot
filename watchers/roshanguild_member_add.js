const { Watcher } = require('aghanim')
const util = require('erisjs-utils')
// const lang = require('../lang.json')

module.exports = new Watcher('','guildMemberAdd',{}, function(guild,member){
  if(guild.id !== this.config.guildID){return};
  if(this.config.switches.welcome){
    const mentionAdmin = util.role.get(guild,this.config.roles.admin);
    //console.log('Mention Admin', mentionAdmin,mentionAdmin.name);
    if(mentionAdmin){
      this.createMessage(guild.id,this.replace.do('roshanGuildnewMemberWelcome',{member : member.mention},true));
    }
  }
  this.logger.add('memberin',member.username,true);
})