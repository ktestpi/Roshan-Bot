const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('lastmatch+',{
  category : 'Dota 2', help : 'Última partida jugada. R+', args : '[mención/dotaID/pro]', cooldown : 60, cooldownMessage : lang.warningInCooldown},
  function(msg, args, command){
    let self = this
    return opendota.odcall(this,msg,args,function(msg,args,profile){
      msg.channel.sendTyping();
      return opendota.request('player_lastmatch',profile.profile.dota).then(results => {
        const cmd = self.commands.find(c => c.name == 'match+')
        if(!cmd){return}
        msg.content = self.defaultPrefix + cmd.name + ' ' + results[0][0].match_id;
        args[0] = cmd.name;
        args[1] = results[0][0].match_id
        return cmd.process.call(self,msg,args,cmd)
      }).catch(err => this.discordLog.send('oderror',lang.errorOpendotaRequest,lang.errorOpendotaRequest,err,msg.channel))
    })
  })
