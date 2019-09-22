const { Command } = require('aghanim')
const paintjimp = require('../../paintjimp')

module.exports = new Command('matches+',{
  category : 'Dota 2', help : 'Últimas partidas jugadas. R+', args : '', cooldown : 20, enable : true},
  async function(msg, args, client, command){
    msg.channel.sendTyping()
    return client.components.Opendota.userID(msg, args)
    .then(player => Promise.all([
      player,
      client.components.Opendota.player_matches(player.data.dota)
        .catch(err => { throw new UserError('opendota', 'error.opendotarequest', err) })
    ])).then(([player, results]) => {
      return paintjimp.matches(results)
      // .then(buffer => client.createMessage(client.config.guild.generated, `**${msg.author.username}** matches`, { file: buffer, name: `${player.id}-matches.jpg` }))
      .then(buffer => msg.reply(`**${msg.author.username}** matches`, null, { file: buffer, name: `${player.id}-matches.jpg` }))
      // .then(m => {
          //   return msg.reply(embed, {
          //     team: odutil.winnerTeam(results[0]),
          //     match_type: results[0].league ? ' :trophy: ' + results[0].league.name : enumLobbyType.getValue(results[0].lobby_type),
          //     match_skill: enumSkill.getValue(results[0].skill) || '',
          //     match_id: results[0].match_id,
          //     match_link: client.config.links.profile.dotabuff.slice(0, -8) + 'matches/' + results[0].match_id,
          //     duration: odutil.durationTime(results[0].duration),
          //     time: Datee.custom(results[0].start_time * 1000, 'h:m D/M/Y', true),
          //     _match_image: m.attachments[0].url
          //   })
          // })
    })
    
  })


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