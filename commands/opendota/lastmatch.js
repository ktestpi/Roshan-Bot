const { Command } = require('aghanim')
const { UserError, ConsoleError } = require('../../classes/errors.js')

module.exports = new Command('lastmatch',{
  category : 'Dota 2', help : 'Última partida jugada', args : '[mención/dotaID/pro]'},
  async function(msg, args, client){

    msg.channel.sendTyping()
    return client.components.Opendota.userID(msg, args)
      .then(player => Promise.all([
        player,
        client.components.Opendota.player_lastmatch(player.data.dota)
          .catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
      ]))
      .then(data => {
        const [player, results] = data
        const cmd = client.commands.find(c => c.name == 'match')
        if (!cmd) { return }
        msg.content = client.defaultPrefix + cmd.name + ' ' + results[0][0].match_id;
        args[0] = cmd.name;
        args[1] = results[0][0].match_id
        return cmd.process(msg, args, client, cmd)
      })
  })
