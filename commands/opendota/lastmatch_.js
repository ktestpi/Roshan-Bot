const { Command } = require('aghanim')
const basic = require('../../helpers/basic')
const { UserError, ConsoleError } = require('../../classes/errormanager.js')

module.exports = new Command('lastmatch+',{
  category : 'Dota 2', help : 'Última partida jugada. R+', args : '[mención/dotaID/pro]', cooldown : 60,
  cooldownMessage : function(msg,args,command,cooldown){return this.locale.getUserString('warningInCooldown',msg)}},
  function(msg, args, command){
    msg.channel.sendTyping()
    return this.plugins.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        this.plugins.Opendota.player_lastmatch(player.data.profile.dota)
          .catch(err => { throw new UserError('opendota', 'errorOpendotaRequest', err) })
        ]
      ))
      .then(data => {
        const [player, results] = data

        const cmd = this.commands.find(c => c.name == 'match+')
        if (!cmd) { return }

        msg.content = this.defaultPrefix + cmd.name + ' ' + results[0][0].match_id;

        args[0] = cmd.name;
        args[1] = results[0][0].match_id
        return cmd.process.call(this, msg, args, command)
      })
  })
