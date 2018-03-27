const { Command } = require('aghanim')
const opendota = require('../helpers/opendota')
const basic = require('../helpers/basic')
const lang = require('../lang.json')

module.exports = new Command('lastmatch',{
  category : 'Dota 2', help : 'Última partida jugada', args : '[mención/dotaID/pro]'},
  function(msg, args, command){
    let self = this
    opendota.odcall(this,msg,args,function(msg,args,profile){
      msg.channel.sendTyping();
      opendota.request('player_lastmatch',profile.id.dota).then(results => {
        const cmd = self.commands.find(c => c.name == 'match')
        if(!cmd){return}
        // console.log(cmd);
        msg.content = self.defaultPrefix + cmd.name + ' ' + results[0][0].match_id;
        // console.log('MATCH MSG CONTENT',msg.content);
        args[0] = cmd.name;
        args[1] = results[0][0].match_id
        cmd.process.call(self,msg,args,command)
      }).catch(e => {opendota.error(self,msg,lang.errorOpendotaRequest,e)})
    })
  })
