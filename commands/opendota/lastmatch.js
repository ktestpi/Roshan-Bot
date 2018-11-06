const { Command } = require('aghanim')
const basic = require('../../helpers/basic')

module.exports = new Command('lastmatch',{
  category : 'Dota 2', help : 'Última partida jugada', args : '[mención/dotaID/pro]'},
  function(msg, args, command){

    msg.channel.sendTyping()
    return this.od.userID(msg, args)
      .then(player => Promise.all([player, this.od.player_lastmatch(player.data.profile.dota)]))
      .then(data => {
        const [player, results] = data

        const cmd = this.commands.find(c => c.name == 'match')
        if (!cmd) { return }

        msg.content = this.defaultPrefix + cmd.name + ' ' + results[0][0].match_id;

        args[0] = cmd.name;
        args[1] = results[0][0].match_id
        return cmd.process.call(this, msg, args, command)
      }).catch(err => this.od.error(msg, err))
  })
