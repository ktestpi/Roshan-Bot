module.exports = {
  name: 'lastmatch+',
  category : 'Dota 2', 
  help : 'Última partida jugada. R+', 
  args : '[mención/dotaID/pro]',
  requirements: [
    { 
      type: "user.cooldown",
      time: 60,
      response: (msg, args, command, cooldown) => msg.author.locale('cmd.incooldown')
    },
    "is.dota.player"
  ],
  run: async function (msg, args, client, command){
    msg.channel.sendTyping()
    const [player, results] = await Promise.all([
      args.profile,
      client.components.Opendota.player_lastmatch(args.profile.data.dota)
    ])

    const cmd = client.commands.find(c => c.name == 'match+')
    if (!cmd) { return }
    msg.content = client.prefix + cmd.name + ' ' + results[0][0].match_id;

    args[0] = cmd.name;
    args[1] = results[0][0].match_id
    return await cmd.run(msg, args, client, cmd)
  }
}
