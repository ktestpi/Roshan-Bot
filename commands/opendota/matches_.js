const paintjimp = require('../../paintjimp')

module.exports = {
  name: 'matches+',
  category : 'Dota 2',
  help : 'Últimas partidas jugadas. R+',
  args : '',
  requirements: [
    {
      type: "user.cooldown",
      time: 20,
      response: (msg, args, client, command, req) => msg.author.locale('cmd.incooldown', {cd : args.reqUserCooldown.cooldown, username: args.reqUserCooldown.user})
    },
    "is.dota.player"
  ],
  run: async function(msg, args, client, command){
    msg.channel.sendTyping()
    const [player, results] = await Promise.all([
      args.profile,
      client.components.Opendota.player_matches(args.profile.data.dota)
    ])
    return paintjimp.matches(results)
      // .then(buffer => client.createMessage(client.config.guild.generated, `**${msg.author.username}** matches`, { file: buffer, name: `${player.id}-matches.jpg` }))
      .then(buffer => msg.reply(`**${msg.author.username}** matches`, null, { file: buffer, name: `${player.id}-matches.jpg` }))
  }
}


  // {
  //   match_id: 5016541891,
  //   player_slot: 132,
  //   radiant_win: true,
  //   hero_id: 18,
  //   start_time: 1568168022,
  //   duration: 3828,
  //   game_mode: 22,
  //   lobby_type: 0,
  //   version: 21,
  //   kills: 9,
  //   deaths: 6,
  //   assists: 34,
  //   skill: null,
  //   leaver_status: 0,
  //   party_size: 1
  // }